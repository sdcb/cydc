using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers
{
    public class FoodOrderController : Controller
    {
        private readonly CydcContext _db;

        public FoodOrderController(CydcContext db)
        {
            _db = db;
        }

        public int Count()
        {
            return _db.FoodOrder.Count();
        }
    }
}