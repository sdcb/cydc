﻿using System.ComponentModel.DataAnnotations;
using System;
using System.Linq;
using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace cydc.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly CydcContext _db;
        private readonly UserManager _userManager;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            CydcContext db, 
            UserManager userManager, 
            ILogger<AdminController> logger)
        {
            _db = db;
            _userManager = userManager;
            _logger = logger;
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
        public async Task<IActionResult> SaveOrderComment(int orderId, [FromBody]string comment)
        {
            FoodOrder order = await _db.FoodOrder.FindAsync(orderId);
            order.Comment = comment;
            await _db.SaveChangesAsync();
            return Ok(order.Comment);
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
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            FoodOrder foodOrder = await _db.FoodOrder
                .Include(x => x.FoodOrderPayment)
                .Include(x => x.AccountDetails)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (foodOrder.FoodOrderPayment != null) return BadRequest("Payment already exists.");
            if (foodOrder.AccountDetails.Any(x => x.Amount > 0)) return BadRequest("Account already exists.");

            foreach (var item in foodOrder.AccountDetails)
            {
                _db.Entry(item).State = EntityState.Deleted;
            }
            _db.Entry(foodOrder).State = EntityState.Deleted;
            return Ok(await _db.SaveChangesAsync());
        }

        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Pay(int orderId)
        {
            FoodOrder foodOrder = await _db.FoodOrder
                .Include(x => x.FoodOrderPayment)
                .Include(x => x.AccountDetails)
                .FirstOrDefaultAsync(x => x.Id == orderId);
            if (foodOrder.FoodOrderPayment != null) return BadRequest("Payment already exists.");
            if (foodOrder.AccountDetails.Sum(x => x.Amount) >= 0) return BadRequest("No amount exists.");

            var payment = new FoodOrderPayment
            {
                FoodOrderId = orderId,
                PayedTime = DateTime.Now,
            };
            _db.Entry(payment).State = EntityState.Added;

            AccountDetails accounting = new AccountDetails
            {
                Amount = -foodOrder.AccountDetails.Sum(x => x.Amount),
                CreateTime = DateTime.Now,
                FoodOrderId = orderId,
                UserId = foodOrder.OrderUserId,
            };
            _db.Entry(accounting).State = EntityState.Added;

            return Ok(await _db.SaveChangesAsync());
        }

        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BatchPay([Required]string userId, [Required]decimal amount, [FromBody]int[] orderIds)
        {
            foreach (var orderId in orderIds)
            {
                FoodOrder foodOrder = await _db.FoodOrder
                                .Include(x => x.FoodOrderPayment)
                                .Include(x => x.AccountDetails)
                                .FirstOrDefaultAsync(x => x.Id == orderId);
                if (foodOrder.FoodOrderPayment != null) return BadRequest("Payment already exists.");
                if (foodOrder.AccountDetails.Sum(x => x.Amount) >= 0) return BadRequest("No amount exists.");

                var payment = new FoodOrderPayment
                {
                    FoodOrderId = orderId,
                    PayedTime = DateTime.Now,
                };
                _db.Entry(payment).State = EntityState.Added;
            }

            AccountDetails accounting = new AccountDetails
            {
                Amount = amount,
                CreateTime = DateTime.Now,
                UserId = userId,
            };
            _db.Entry(accounting).State = EntityState.Added;

            return Ok(await _db.SaveChangesAsync());
        }

        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Unpay(int orderId)
        {
            FoodOrder foodOrder = await _db.FoodOrder
                .Include(x => x.FoodOrderPayment)
                .Include(x => x.AccountDetails)
                .FirstOrDefaultAsync(x => x.Id == orderId);
            if (foodOrder.FoodOrderPayment == null) return BadRequest("Payment does not exists.");

            _db.Entry(foodOrder.FoodOrderPayment).State = EntityState.Deleted;
            if (foodOrder.AccountDetails.Any(x => x.Amount > 0))
            {
                _db.Entry(foodOrder.AccountDetails.First(x => x.Amount > 0)).State = EntityState.Deleted;
            }

            return Ok(await _db.SaveChangesAsync());
        }

        public async Task<string> GetUserIdByUserName(string userName)
        {
            userName = userName.Trim();
            return await _db.Users
                .Where(x => x.NormalizedUserName == userName)
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }
    }
}