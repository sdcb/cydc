using Microsoft.AspNetCore.Http;
using System.Linq;

namespace cydc.Infrastructure;

public class ClientIPAccessor(IHttpContextAccessor httpContextAccessor)
{
    public string GetClientIP()
    {
        // check X-Forwarded-For header first, if not found, use RemoteIpAddress
        return httpContextAccessor.HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? 
            httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
    }
}
