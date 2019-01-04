﻿using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers
{
    public class UserController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly SignInManager<AspNetUsers> _signInManager;

        public UserController(
            IHostingEnvironment hostingEnvironment, 
            SignInManager<AspNetUsers> signInManager)
        {
            _hostingEnvironment = hostingEnvironment;
            _signInManager = signInManager;
        }

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

        public string Name { get; set; }

        public bool IsAdmin { get; set; }
    }
}