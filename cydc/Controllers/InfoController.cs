using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers;

[Authorize]
public class InfoController(CydcContext db) : Controller
{
    private readonly CydcContext _db = db;

    [AllowAnonymous]
    public IActionResult Ps()
    {
        return Ok(Process.GetCurrentProcess().ProcessName);
    }

    public IEnumerable<object> Menu()
    {
        return _db.FoodMenu.Where(x => x.Enabled).Select(x => new
        {
            Id = x.Id, 
            Price = x.Price, 
            Title = x.Title, 
            Details = x.Details, 
        });
    }

    public IEnumerable<object> Address()
    {
        return _db.Location.Where(x => x.Enabled).Select(x => new
        {
            Id = x.Id, 
            Location = x.Name
        });
    }

    public IEnumerable<object> Taste()
    {
        return _db.TasteType.Where(x => x.Enabled).Select(x => new
        {
            Id = x.Id, 
            Name = x.Name
        });
    }
}