using cydc.Controllers.AdmimDtos;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace cydc.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminMenuController : Controller
    {
        private readonly CydcContext _db;

        public AdminMenuController(CydcContext db)
        {
            _db = db;
        }

        public async Task<AdmimDtos.PagedResult<MenuDto>> Menus(MenuQuery query)
        {
            return await query.DoQuery(_db);
        }

        public async Task<bool> ToggleStatus(int menuId)
        {
            FoodMenu menu = _db.FoodMenu.Find(menuId);
            menu.Enabled = !menu.Enabled;
            await _db.SaveChangesAsync();
            return menu.Enabled;
        }

        public async Task<string> SaveContent(int menuId, [FromBody][Required] string content)
        {
            FoodMenu menu = _db.FoodMenu.Find(menuId);
            menu.Details = content;
            await _db.SaveChangesAsync();
            return content;
        }

        public async Task<decimal> SavePrice(int menuId, [Required] decimal price)
        {
            FoodMenu menu = _db.FoodMenu.Find(menuId);
            menu.Price = price;
            await _db.SaveChangesAsync();
            return price;
        }
    }
}
