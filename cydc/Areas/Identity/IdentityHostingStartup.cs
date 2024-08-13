using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(cydc.Areas.Identity.IdentityHostingStartup))]
namespace cydc.Areas.Identity;

public class IdentityHostingStartup : IHostingStartup
{
    public void Configure(IWebHostBuilder builder)
    {
        builder.ConfigureServices((context, services) => {
        });
    }
}