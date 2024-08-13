using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Sdcb.AspNetCore.Authentication.YeluCasSso;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace cydc.Areas.Identity.Pages.Account;

[AllowAnonymous]
public class ExternalLoginModel(
    SignInManager<User> signInManager,
    UserManager<User> userManager,
    ILogger<ExternalLoginModel> logger) : PageModel
{
    private readonly SignInManager<User> _signInManager = signInManager;
    private readonly UserManager<User> _userManager = userManager;
    private readonly ILogger<ExternalLoginModel> _logger = logger;

    [BindProperty]
    public InputModel Input { get; set; }

    public string LoginProvider { get; set; }

    public string ReturnUrl { get; set; }

    [TempData]
    public string ErrorMessage { get; set; }

    public class InputModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public IActionResult OnGetAsync()
    {
        return RedirectToPage("./Login");
    }

    public IActionResult OnPost(string provider, string returnUrl = null)
    {
        // Request a redirect to the external login provider.
        var redirectUrl = Url.Page("./ExternalLogin", pageHandler: "Callback", values: new { returnUrl });
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        return new ChallengeResult(provider, properties);
    }

    public async Task<IActionResult> OnGetCallbackAsync(string returnUrl = null, string remoteError = null)
    {
        returnUrl = returnUrl ?? Url.Content("~/");
        if (remoteError != null)
        {
            ErrorMessage = $"Error from external provider: {remoteError}";
            return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
        }

        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            ErrorMessage = "Error loading external login information.";
            return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
        }

        // Sign in the user with this external login provider if the user already has a login.
        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
        if (result.Succeeded)
        {
            _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
            return LocalRedirect(returnUrl);
        }
        if (result.IsLockedOut)
        {
            return RedirectToPage("./Lockout");
        }
        else
        {
            if (info.LoginProvider == YeluCasSsoDefaults.AuthenticationScheme)
            {
                if (await LoginByYeluCasSsoAsync(info))
                {
                    return LocalRedirect(returnUrl);
                }
            }
            // If the user does not have an account, then ask the user to create an account.
            ReturnUrl = returnUrl;
            LoginProvider = info.LoginProvider;
            if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email))
            {
                Input = new InputModel
                {
                    Email = info.Principal.FindFirstValue(ClaimTypes.Email)
                };
            }
            return Page();
        }
    }

    private async Task<bool> LoginByYeluCasSsoAsync(ExternalLoginInfo info)
    {
        string email = info.Principal.FindFirstValue(CasConstants.Email);
        string userName = info.Principal.FindFirstValue(CasConstants.Name);

        User user = 
            await _userManager.FindByEmailAsync(email) ??
            await _userManager.FindByNameAsync(userName);

        if (user == null)
        {
            user = new User
            {
                UserName = info.Principal.FindFirstValue(CasConstants.Name),
                Email = info.Principal.FindFirstValue(CasConstants.Email),
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded) return false;
        }

        IList<UserLoginInfo> logins = await _userManager.GetLoginsAsync(user);
        if (logins.All(x => x.LoginProvider != YeluCasSsoDefaults.AuthenticationScheme))
        {
            _logger.LogInformation($"User created an account using {info.LoginProvider} provider.");
            var result = await _userManager.AddLoginAsync(user, info);
            if (!result.Succeeded) return false;
        }

        await _signInManager.SignInAsync(user, isPersistent: false);
        return true;
    }

    public async Task<IActionResult> OnPostConfirmationAsync(string returnUrl = null)
    {
        returnUrl = returnUrl ?? Url.Content("~/");
        // Get the information about the user from the external login provider
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            ErrorMessage = "Error loading external login information during confirmation.";
            return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
        }

        if (ModelState.IsValid)
        {
            var user = new User { UserName = Input.Email, Email = Input.Email };
            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                result = await _userManager.AddLoginAsync(user, info);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);
                    return LocalRedirect(returnUrl);
                }
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        LoginProvider = info.LoginProvider;
        ReturnUrl = returnUrl;
        return Page();
    }
}
