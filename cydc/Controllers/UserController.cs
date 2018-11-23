using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Sdcb.AspNetCore.Authentication.YeluCasSso;

namespace cydc.Controllers
{
    public class UserController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public UserController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public UserStatus Status()
        {
            return new UserStatus
            {
                IsLoggedIn = User.Identity.IsAuthenticated,
                Claims = new 
                {
                    Name = User.FindFirst(x => x.Type == CasConstants.Name)?.Value, 
                    IsAdmin = User.IsInRole("Admin")
                }
            };
        }

        public void Logout()
        {
            Response.Cookies.Delete(".AspNetCore.Cookies");
        }

        [Authorize]
        public IActionResult Login(string fromUrl)
        {
            return Redirect(fromUrl);
        }

        public IActionResult Dump()
        {
            if (_hostingEnvironment.EnvironmentName == "Development" ||
                User.IsInRole("Admin"))
            {
                return Json(User.Claims
                    .Select(x => new { x.Type, x.Value })
                    .GroupBy(x => x.Type)
                    .ToDictionary(k => k.Key, v => String.Join(";", v.Select(x => x.Value))));
            }
            else
            {
                return BadRequest("Dump not allowed");
            }
        }
    }

    public class UserStatus
    {
        public bool IsLoggedIn { get; set; }

        public object Claims { get; set; }
    }
}