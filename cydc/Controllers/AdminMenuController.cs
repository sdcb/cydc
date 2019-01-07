using cydc.Controllers.AdmimDtos;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
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

        public async Task<PagedResult<MenuDto>> Menus(MenuQuery query)
        {
            return await query.DoQuery(_db);
        }

        [ValidateAntiForgeryToken]
        public async Task<bool> ToggleStatus(int menuId)
        {
            FoodMenu menu = _db.FoodMenu.Find(menuId);
            menu.Enabled = !menu.Enabled;
            await _db.SaveChangesAsync();
            return menu.Enabled;
        }

        [ValidateAntiForgeryToken]
        public async Task<string> SaveContent(int menuId, [FromBody][Required] string content)
        {
            FoodMenu menu = await _db.FoodMenu.FindAsync(menuId);
            menu.Details = content;
            await _db.SaveChangesAsync();
            return content;
        }

        [ValidateAntiForgeryToken]
        public async Task<decimal> SavePrice(int menuId, [Required] decimal price)
        {
            FoodMenu menu = await _db.FoodMenu.FindAsync(menuId);
            menu.Price = price;
            await _db.SaveChangesAsync();
            return price;
        }

        [ValidateAntiForgeryToken]
        public async Task<string> SaveTitle(int menuId, [FromBody][Required] string title)
        {
            FoodMenu menu = await _db.FoodMenu.FindAsync(menuId);
            menu.Title = title;
            await _db.SaveChangesAsync();
            return title;
        }

        [ValidateAntiForgeryToken]
        public async Task Delete(int menuId)
        {
            FoodMenu menu = await _db.FoodMenu.FindAsync(menuId);
            _db.Entry(menu).State = EntityState.Deleted;
            await _db.SaveChangesAsync();
        }
    }
}
