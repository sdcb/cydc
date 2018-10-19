using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers
{
    public class TestController : Controller
    {
        public string Ps()
        {
            return Process.GetCurrentProcess().ProcessName;
        }
    }
}
