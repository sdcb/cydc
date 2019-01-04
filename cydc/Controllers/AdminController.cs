using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly CydcContext _db;

        public AdminController(CydcContext db)
        {
            _db = db;
        }

        public async Task<PagedResult<AdminUserDto>> Users(AdminUserQuery searchDto)
        {
            return await searchDto.DoQuery(_db);
        }

        public async Task<PagedResult<FoodOrderDto>> Orders(FoodOrderQuery query)
        {
            return await query.DoQuery(_db);
        }

        public async Task<PagedResult<MenuDto>> Menus(MenuQuery query)
        {
            return await query.DoQuery(_db);
        }
    }
}