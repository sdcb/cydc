﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers
{
    public class UserController : Controller
    {
        public UserStatus Status()
        {
            return new UserStatus
            {
                IsLoggedIn = User.Identity.IsAuthenticated,
                Claims = User.Claims.ToDictionary(k => k.Type, k => k.Value),
            };
        }
    }

    public class UserStatus
    {
        public bool IsLoggedIn { get; set; }

        public Dictionary<string, string> Claims { get; set; }
    }
}