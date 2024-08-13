using cydc.Database;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Sdcb.AspNetCore.Authentication.YeluCasSso;
using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace cydc.Controllers;

public class UserController(
    SignInManager<User> signInManager) : Controller
{
    private readonly SignInManager<User> _signInManager = signInManager;

    public UserStatus Status()
    {
        return new UserStatus
        {
            IsLoggedIn = User.Identity.IsAuthenticated,
            Name = User.FindFirst(x => x.Type == ClaimTypes.Name)?.Value,
            IsAdmin = User.IsInRole("Admin"),
        };
    }

    public async Task Logout()
    {
        await _signInManager.SignOutAsync();
    }

    public IActionResult Login(string fromUrl)
    {
        if (!User.Identity.IsAuthenticated)
        {
            string redirectUrl = "/Identity/Account/ExternalLogin?handler=Callback&returnUrl=" + WebUtility.UrlEncode(fromUrl);
            AuthenticationProperties properties = _signInManager.ConfigureExternalAuthenticationProperties(
                YeluCasSsoDefaults.AuthenticationScheme, 
                redirectUrl);
            return new ChallengeResult(YeluCasSsoDefaults.AuthenticationScheme, properties);
        }
        return Redirect(fromUrl);
    }
}

public class UserStatus
{
    public bool IsLoggedIn { get; set; }

    public string Name { get; set; }

    public bool IsAdmin { get; set; }
}