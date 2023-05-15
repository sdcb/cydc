using cydc.Controllers.SmsDtos;
using cydc.Database;
using cydc.Hubs;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

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
            services.AddMvc()
                .AddTextPlainInput();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddDbContext<CydcContext>(options => options.UseSqlServer(Configuration["CydcConnection"]));
            services.Configure<TencentSmsConfig>(Configuration.GetSection("Tencent:SmsConfig"));
            services.Configure<TencentSmsTemplateConfig>(Configuration.GetSection("Tencent:SmsTemplateConfig"));
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
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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

            app.UseRouting();

            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseAntiforgeryToken();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("default", "api/{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
                endpoints.MapHub<NewOrderHub>("/hubs/newOrder");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://127.0.0.1:4200");
                }
            });
        }
    }
}
