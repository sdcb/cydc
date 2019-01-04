using cydc.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sdcb.AspNetCore.Authentication.YeluCasSso;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace cydc.Managers.Identities
{
    public class UserManager : UserManager<AspNetUsers>
    {
        public UserManager(IUserStore<AspNetUsers> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<AspNetUsers> passwordHasher, IEnumerable<IUserValidator<AspNetUsers>> userValidators, IEnumerable<IPasswordValidator<AspNetUsers>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<AspNetUsers>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        internal static async Task OnCreatingClaims(HttpContext httpContext, ClaimsIdentity claimsIdentity)
        {
            var db = httpContext.RequestServices.GetRequiredService<CydcContext>();
            var userManager = httpContext.RequestServices.GetRequiredService<UserManager>();
            var userName = claimsIdentity.FindFirst(CasConstants.Name).Value;
            var email = claimsIdentity.FindFirst(CasConstants.Email).Value;

            var systemUser = 
                await userManager.FindByEmailAsync(email) ?? 
                await userManager.FindByNameAsync(userName);
            if (systemUser == null)
            {
                await userManager.CreateAsync(new AspNetUsers
                {
                    UserName = userName, 
                    Email = email, 
                });
                systemUser = await userManager.FindByEmailAsync(email);
            }

            IList<string> roles = await userManager.GetRolesAsync(systemUser);

            // commit
            claimsIdentity.AddClaim(new Claim(claimsIdentity.NameClaimType, systemUser.Id));
            claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, systemUser.Id));
            foreach (var role in roles)
            {
                claimsIdentity.AddClaim(new Claim(claimsIdentity.RoleClaimType, role));
            }
        }
    }
}
