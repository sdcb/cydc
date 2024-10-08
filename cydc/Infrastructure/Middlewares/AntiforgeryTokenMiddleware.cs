﻿using cydc.Infrastructure.Middlewares;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace cydc.Infrastructure.Middlewares
{
    public class AntiforgeryTokenMiddleware(RequestDelegate next, IAntiforgery antiforgery)
    {
        private readonly RequestDelegate _next = next;
        private readonly IAntiforgery _antiforgery = antiforgery;

        public Task Invoke(HttpContext context)
        {
            if (context.Request.Path == "/api/user/status")
            {
                AntiforgeryTokenSet tokens = _antiforgery.GetAndStoreTokens(context);
                context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions
                {
                    HttpOnly = false, 
                    Secure = true, 
                });
            }
            return _next(context);
        }
    }
}

namespace Microsoft.AspNetCore.Builder
{
    public static class AntiforgeryTokenMiddlewareExtensions
    {
        public static IApplicationBuilder UseAntiforgeryToken(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AntiforgeryTokenMiddleware>();
        }
    }
}
