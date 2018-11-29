using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
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

        public async Task<IActionResult> Create([FromBody]FoodOrderCreateDto order)
        {
            FoodOrder foodOrder = new FoodOrder();
            var menu = await _db.FoodMenu.SingleAsync(x => x.Id == order.MenuId);
            var dateNow = DateTime.Now;

            string userId = await GetUserIdFromUserName(order.IsMe, order.OtherPersonName);
            foodOrder.AccountDetails.Add(new AccountDetails
            {
                UserId = userId,
                CreateTime = dateNow,
                Amount = -menu.Price
            });

            foodOrder.FoodOrderClientInfo = new FoodOrderClientInfo
            {
                Ip = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = Request.Headers["User-Agent"]
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

        private async Task<string> GetUserIdFromUserName(bool isMe, string userName)
        {
            if (isMe) return User.Identity.Name;
            return (await _db.AspNetUsers.FirstAsync(x => x.UserName == userName)).Id;
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