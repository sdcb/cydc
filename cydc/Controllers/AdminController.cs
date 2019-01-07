using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace cydc.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly CydcContext _db;
        private readonly UserManager _userManager;

        public AdminController(CydcContext db, UserManager userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public async Task<PagedResult<AdminUserDto>> Users(AdminUserQuery searchDto)
        {
            return await searchDto.DoQuery(_db);
        }

        public async Task<PagedResult<FoodOrderDto>> Orders(FoodOrderQuery query)
        {
            return await query.DoQuery(_db);
        }

        [ValidateAntiForgeryToken]
        public async Task<bool> ResetPassword(string userId, [FromBody][Required] string password)
        {
            AspNetUsers user = await _userManager.FindByIdAsync(userId);
            string token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var ok = await _userManager.ResetPasswordAsync(user, token, password);
            return ok.Succeeded;
        }
    }
}