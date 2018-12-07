using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sdcb.AspNetCore.Authentication.YeluCasSso;

namespace cydc
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddDbContext<CydcContext>(options => options.UseSqlServer(Configuration["CydcConnection"]));
            services.AddHttpContextAccessor();

            services.AddAuthentication(o =>
            {
                o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = YeluCasSsoDefaults.AuthenticationScheme;
            }).AddCookie(o =>
            {
                o.Events.OnRedirectToLogin = ctx =>
                {
                    ctx.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            }).AddYeluCasSso(o =>
            {
                o.YeluCasSsoEndpoint = Configuration["YeluCasSsoEndpoint"];
                o.Events.OnCreatingClaims = OnCreatingClaims;
            });
        }

        private async Task OnCreatingClaims(HttpContext httpContext, ClaimsIdentity claimsIdentity)
        {
            var db = httpContext.RequestServices.GetRequiredService<CydcContext>();
            var userName = claimsIdentity.FindFirst(CasConstants.Name).Value;
            var email = claimsIdentity.FindFirst(CasConstants.Email).Value;

            string systemId = await db.AspNetUsers
                .Where(x => x.NormalizedEmail == email || x.NormalizedUserName == userName)
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
            if (systemId == null) throw new Exception("User not found in system.");

            List<string> roles = await db.AspNetUserRoles
                .Where(x => x.UserId == systemId)
                .Select(x => x.Role.Name)
                .ToListAsync();

            // commit
            claimsIdentity.AddClaim(new Claim(claimsIdentity.NameClaimType, systemId));
            foreach (var role in roles)
            {
                claimsIdentity.AddClaim(new Claim(claimsIdentity.RoleClaimType, role));
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "api/{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
