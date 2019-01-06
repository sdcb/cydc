using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cydc.Controllers
{
    [Authorize]
    public class FoodOrderController : Controller
    {
        private readonly CydcContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FoodOrderController(
            CydcContext db, 
            IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _httpContextAccessor = httpContextAccessor;
        }
        
        public string SiteNotification()
        {
            return _db.SiteNotice.FirstOrDefault().Content;
        }

        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([FromBody]FoodOrderCreateDto order)
        {
            if (!User.IsInRole("Admin") && !order.IsMe)
            {
                return BadRequest("Only admin can specify OtherPersonName.");
            }

            string userId = await GetUserIdFromUserName(order.IsMe, order.OtherPersonName);
            if (userId == null)
            {
                return BadRequest($"User {order.OtherPersonName} cannot found.");
            }

            FoodOrder foodOrder = new FoodOrder();
            var menu = await _db.FoodMenu.SingleAsync(x => x.Id == order.MenuId);
            var dateNow = DateTime.Now;

            foodOrder.AccountDetails.Add(new AccountDetails
            {
                UserId = userId,
                CreateTime = dateNow,
                Amount = -menu.Price
            });

            foodOrder.FoodOrderClientInfo = new FoodOrderClientInfo
            {
                Ip = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = $"{Request.Host}@{Request.Headers["User-Agent"]}"
            };

            foodOrder.OrderUserId = userId;
            foodOrder.OrderTime = dateNow;
            foodOrder.LocationId = order.AddressId;
            foodOrder.FoodMenuId = order.MenuId;
            foodOrder.TasteId = order.TasteId;
            foodOrder.Comment = order.Comment;
            _db.Add(foodOrder);
            await _db.SaveChangesAsync();

            decimal amount = await _db.AccountDetails.Where(x => x.UserId == userId).SumAsync(x => x.Amount);
            if (amount >= 0)
            {
                await AutoPay(foodOrder);
            }
            return Ok();
        }

        public IActionResult My()
        {
            return Ok(_db.FoodOrder
                .Where(x => x.OrderUserId == User.GetUserId())
                .OrderByDescending(x => x.OrderTime)
                .Select(x => new FoodOrderDto
                {
                    Id = x.Id, 
                    UserName = x.OrderUser.UserName, 
                    OrderTime = x.OrderTime, 
                    Menu = x.FoodMenu.Title, 
                    Details = x.FoodMenu.Details, 
                    Price = x.FoodMenu.Price, 
                    Comment = x.Comment, 
                    IsPayed = x.FoodOrderPayment != null
                })
                .Take(100));
        }

        public async Task<IActionResult> MyBalance()
        {
            decimal balance = await _db.AccountDetails
                .Where(x => x.UserId == User.GetUserId())
                .SumAsync(x => x.Amount);
            return Ok(balance);
        }

        public async Task<IActionResult> SaveComment(int orderId, [FromBody]string comment)
        {
            FoodOrder order = await _db.FoodOrder.FindAsync(orderId);
            if (order.OrderUserId != User.GetUserId()) return Forbid();
            if (order.OrderTime < DateTime.Now.Date) return BadRequest("Order must be today.");

            order.Comment = comment;
            await _db.SaveChangesAsync();
            return Ok(order.Comment);
        }

        private async Task<string> GetUserIdFromUserName(bool isMe, string userName)
        {
            if (isMe) return User.GetUserId();
            return (await _db.Users.FirstOrDefaultAsync(x => x.UserName == userName))?.Id;
        }

        private async Task<int> AutoPay([FromBody] FoodOrder order)
        {
            order = await _db.FoodOrder
                .Include(x => x.FoodOrderPayment)
                .SingleAsync(x => x.Id == order.Id);
            order.FoodOrderPayment = new FoodOrderPayment
            {
                PayedTime = DateTime.Now
            };
            return await _db.SaveChangesAsync();
        }

        [Authorize(Roles = "Admin")]
        public async Task<List<string>> SearchName(string name)
        {
            return await _db.Users
                .Where(x => x.NormalizedUserName.Contains(name.ToUpperInvariant()))
                .OrderByDescending(x => x.FoodOrder.Count)
                .Select(x => x.UserName)
                .Take(5)
                .ToListAsync();
        }
    }

    public class FoodOrderCreateDto
    {
        public int AddressId { get; set; }

        public int TasteId { get; set; }

        public int MenuId { get; set; }

        public bool IsMe { get; set; }

        public string OtherPersonName { get; set; }

        public string Comment { get; set; }
    }
}