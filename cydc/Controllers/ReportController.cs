using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cydc.Controllers;

[Authorize]
public class ReportController(
    CydcContext db) : Controller
{
    private readonly CydcContext _db = db;
    private const int MaxDay = 90;

    public bool IsAdmin => User.IsInRole("Admin");

    public IActionResult DayOrders(int days)
    {
        if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

        Dictionary<DayOfWeek, int> dayOrdersNotAll = _db.FoodOrder
            .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
            .Select(v => v.OrderTime)
            .AsEnumerable()
            .GroupBy(x => x.DayOfWeek)
            .Select(x => new
            {
                DayOfWeek = x.Key,
                Count = x.Count(),
            })
            .ToDictionary(k => k.DayOfWeek, v => v.Count);
        var total = IsAdmin ? 100.0f : dayOrdersNotAll.Sum(x => x.Value);

        return Ok(new[] { 1, 2, 3, 4, 5, 6, 0 }
            .Select(x => (DayOfWeek)x)
            .Select(x => dayOrdersNotAll.ContainsKey(x) ? dayOrdersNotAll[x] : 0)
            .Select(x => MathF.Round(x / total * 100, 2))
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
        var total = IsAdmin ? 100.0f : hourOrdersNotAll.Sum(x => x.Value);

        return Ok(Enumerable.Range(7, 6)
            .Select(x => hourOrdersNotAll.ContainsKey(x) ? hourOrdersNotAll[x] : 0)
            .Select(x => MathF.Round(x / total * 100, 2))
            .ToArray());
    }

    public async Task<IActionResult> TasteOrders(int days)
    {
        if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

        var total = IsAdmin ? 100.0f : await _db.FoodOrder
            .Where(x => x.OrderTime > DateTime.Now.AddDays(-days))
            .CountAsync();
        return Ok(await _db.FoodOrder
            .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
            .GroupBy(x => x.Taste.Name)
            .Select(x => new
            {
                Name = x.Key,
                Count = MathF.Round(x.Count() / total * 100, 2),
            })
            .ToDictionaryAsync(k => k.Name, v => v.Count));
    }

    public async Task<IActionResult> LocationOrders(int days)
    {
        if (days > MaxDay) return BadRequest($"Days should never greater than {MaxDay}.");

        var total = IsAdmin ? 100.0f : await _db.FoodOrder
            .Where(x => x.OrderTime > DateTime.Now.AddDays(-days))
            .CountAsync();
        var data = await _db.FoodOrder
            .Where(f => f.OrderTime > DateTime.Now.AddDays(-days))
            .GroupBy(x => x.Location.Name)
            .Select(x => new
            {
                Location = x.Key,
                Count = MathF.Round(x.Count() / total * 100, 2),
            })
            .ToDictionaryAsync(k => k.Location, v => v.Count);
        return Ok(data);
    }
}