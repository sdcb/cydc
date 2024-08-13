using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers;

[Authorize(Roles = "Admin")]
public class DataManageController(CydcContext db) : Controller
{
    private readonly CydcContext _db = db;

    public IEnumerable<object> Location()
    {
        return _db.Location.Select(x => new
        {
            Id = x.Id, 
            Location = x.Name, 
            Enabled = x.Enabled, 
            FoodOrderCount = x.FoodOrder.Count, 
        });
    }

    public async Task<bool> ToggleLocationEnabled(int locationId)
    {
        Location location = await _db.Location.FindAsync(locationId);
        location.Enabled = !location.Enabled;
        await _db.SaveChangesAsync();
        return location.Enabled;
    }

    public async Task<string> SaveLocationName(int locationId, [FromBody][Required]string name)
    {
        Location location = await _db.Location.FindAsync(locationId);
        location.Name = name;
        await _db.SaveChangesAsync();
        return location.Name;
    }

    public async Task DeleteLocation(int locationId)
    {
        Location location = await _db.Location.FindAsync(locationId);
        _db.Remove(location);
        await _db.SaveChangesAsync();
    }

    public async Task<int> CreateLocation([FromBody][Required]string name)
    {
        Location location = new()
        {
            Enabled = true, 
            Name = name
        };
        _db.Add(location);
        await _db.SaveChangesAsync();
        return location.Id;
    }

    public IEnumerable<object> Taste()
    {
        return _db.TasteType.Select(x => new
        {
            Id = x.Id, 
            Name = x.Name, 
            Enabled = x.Enabled, 
            FoodOrderCount = x.FoodOrder.Count
        });
    }

    public async Task<bool> ToggleTasteEnabled(int tasteId)
    {
        TasteType taste = await _db.TasteType.FindAsync(tasteId);
        taste.Enabled = !taste.Enabled;
        await _db.SaveChangesAsync();
        return taste.Enabled;
    }

    public async Task<string> SaveTasteName(int tasteId, [FromBody][Required]string name)
    {
        TasteType taste = await _db.TasteType.FindAsync(tasteId);
        taste.Name = name;
        await _db.SaveChangesAsync();
        return taste.Name;
    }

    public async Task DeleteTaste(int tasteId)
    {
        TasteType taste = await _db.TasteType.FindAsync(tasteId);
        _db.Remove(taste);
        await _db.SaveChangesAsync();
    }

    public async Task<int> CreateTaste([FromBody][Required]string name)
    {
        TasteType taste = new()
        {
            Enabled = true, 
            Name = name, 
        };
        _db.Add(taste);
        await _db.SaveChangesAsync();
        return taste.Id;
    }

    public async Task SaveSiteNotification([FromBody][Required]string siteNotification)
    {
        SiteNotice notice = _db.SiteNotice.First();
        notice.Content = siteNotification;
        await _db.SaveChangesAsync();
    }
}