using System.ComponentModel.DataAnnotations;
using System;
using System.Linq;
using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        public async Task<int> TodayOrders()
        {
            return await _db.FoodOrder.Where(x => x.OrderTime.Date == DateTime.Now.Date).CountAsync();
        }

        [ValidateAntiForgeryToken]
        public async Task DeleteOrder(int orderId)
        {
            FoodOrder order = await _db.FoodOrder.FindAsync(orderId);
            _db.Entry(order).State = EntityState.Deleted;
            await _db.SaveChangesAsync();
        }

        [ValidateAntiForgeryToken]
        public async Task Pay(int orderId)
        {
            FoodOrderPayment payment = await _db.FoodOrderPayment.FirstOrDefaultAsync(x => x.FoodOrderId == orderId);
            if (payment == null)
            {
                payment = new FoodOrderPayment
                {
                    FoodOrderId = orderId, 
                    PayedTime = DateTime.Now, 
                };
                _db.Entry(payment).State = EntityState.Added;
            }
            else
            {
                payment.PayedTime = DateTime.Now;
                _db.Entry(payment).State = EntityState.Modified;
            }
            await _db.SaveChangesAsync();
        }
    }
}