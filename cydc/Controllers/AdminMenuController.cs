using cydc.Controllers.AdmimDtos;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    }
}
