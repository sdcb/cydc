using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers
{
    [Authorize]
    public class FoodOrderController : Controller
    {
        private readonly CydcContext _db;

        public FoodOrderController(CydcContext db)
        {
            _db = db;
        }

        public string SiteNotification()
        {
            return _db.SiteNotice.FirstOrDefault().Content;
        }
    }
}