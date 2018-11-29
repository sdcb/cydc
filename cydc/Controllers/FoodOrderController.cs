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

        public IActionResult UserInfo()
        {
            return Ok(new
            {
                UserAgent = Request.Headers["User-Agent"].ToString(),
                IP = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString()
            });
        }

        public async Task<int> Create(FoodOrderCreateDto order)
        {
            FoodOrder foodOrder = new FoodOrder();
            var menu = await _db.FoodMenu.SingleAsync(x => x.Id == order.MenuId);
            var dateNow = DateTime.Now;

            foodOrder.FoodOrderClientInfo = new FoodOrderClientInfo
            {
                Ip = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = Request.Headers["User-Agent"]
            };

            var userName = order.OtherPersonName;
            var userId = "";
            if (!string.IsNullOrEmpty(userName))
            {
                userId = _db.AspNetUsers.First(x => x.UserName == userName).Id;
            }
            else
            {
                userId = User.Identity.Name;
            }

            IQueryable<AccountDetails> data = _db.AccountDetails;
            var amount = data.Where(x => x.UserId == userId).Sum(x => x.Amount);

            foodOrder.AccountDetails.Add(new AccountDetails
            {
                UserId = userId,
                CreateTime = dateNow,
                Amount = -menu.Price
            });

            foodOrder.OrderUserId = userId;
            foodOrder.OrderTime = dateNow;
            foodOrder.LocationId = order.AddressId;
            foodOrder.FoodMenuId = order.MenuId;
            foodOrder.TasteId = order.TasteId;
            foodOrder.Comment = order.Comment;
            _db.Add(foodOrder);
            await _db.SaveChangesAsync();

            if (amount >= menu.Price)
            {
                return 3;
                //return await AutoPay(foodOrder);
            }
            else
            {
                return 0;
            }
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