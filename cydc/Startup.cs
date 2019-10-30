using cydc.Database;
using cydc.Hubs;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
            string key = Configuration["ApplicationInsights:InstrumentationKey"];
            services.AddApplicationInsightsTelemetry(key);

            services.AddMvc()
                .AddTextPlainInput()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddDbContext<CydcContext>(options => options.UseSqlServer(Configuration["CydcConnection"]));
            services.AddHttpContextAccessor();
            services.AddAntiforgery(o => o.HeaderName = "X-XSRF-TOKEN");
            services.AddSignalR();

            services.AddDefaultIdentity<User>(o =>
                {
                    o.User.RequireUniqueEmail = true;
                    o.User.AllowedUserNameCharacters = null;
                })
                .AddDefaultUI()
                .AddUserManager<UserManager>()
                .AddRoles<IdentityRole<int>>()
                .AddEntityFrameworkStores<CydcContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication().AddYeluCasSso(o =>
            {
                o.YeluCasSsoEndpoint = Configuration["YeluCasSsoEndpoint"];
                o.Events.OnCreatingClaims = UserManager.OnCreatingClaims;
            });
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
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();
            app.UseAntiforgeryToken();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "api/{controller}/{action=Index}/{id?}");
            });

            app.UseSignalR(o =>
            {
                o.MapHub<NewOrderHub>("/hubs/newOrder");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
