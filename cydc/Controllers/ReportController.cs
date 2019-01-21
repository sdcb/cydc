using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cydc.Controllers
{
    [Authorize]
    public class ReportController : Controller
    {
        private readonly CydcContext _db;
        private const int MaxDay = 90;

        public ReportController(
            CydcContext db)
        {
            _db = db;
        }

        public async Task<IActionResult> DayOrders(int days)
        {
            if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

            Dictionary<DayOfWeek, int> dayOrdersNotAll = await _db.FoodOrder
                .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
                .GroupBy(x => x.OrderTime.DayOfWeek)
                .Select(x => new
                {
                    DayOfWeek = x.Key,
                    Count = x.Count(),
                })
                .ToDictionaryAsync(k => k.DayOfWeek, v => v.Count);

            return Ok(new[] { 1, 2, 3, 4, 5, 6, 0 }
                .Select(x => (DayOfWeek)x)
                .Select(x => dayOrdersNotAll.ContainsKey(x) ? dayOrdersNotAll[x] : 0)
                .ToArray());
        }

        public async Task<IActionResult> HourOrders(int days)
        {
            if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

            Dictionary<int, int> hourOrdersNotAll = await _db.FoodOrder
                .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
                .GroupBy(x => x.OrderTime.Hour)
                .Select(x => new
                {
                    Hour = x.Key,
                    Count = x.Count(),
                })
                .ToDictionaryAsync(k => k.Hour, v => v.Count);

            return Ok(Enumerable.Range(7, 6)
                .Select(x => hourOrdersNotAll.ContainsKey(x) ? hourOrdersNotAll[x] : 0)
                .ToArray());
        }

        public async Task<IActionResult> TasteOrders(int days)
        {
            if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

            return Ok(await _db.FoodOrder
                .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
                .GroupBy(x => x.Taste.Name)
                .Select(x => new
                {
                    Name = x.Key,
                    Count = x.Count(),
                })
                .ToDictionaryAsync(k => k.Name, v => v.Count));
        }

        public async Task<IActionResult> LocationOrders(int days)
        {
            if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

            var data = await _db.FoodOrder
                .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
                .GroupBy(x => x.Location.Name)
                .Select(x => new
                {
                    Location = x.Key,
                    Count = x.Count(),
                })
                .ToDictionaryAsync(k => k.Location, v => v.Count);
            return Ok(data);
        }
    }
}