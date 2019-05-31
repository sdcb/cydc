using cydc.Controllers.FoodOrders;
using cydc.Database;
using cydc.Hubs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers
{
    public class SmsController : Controller
    {
        private readonly ILogger _logger;
        private readonly CydcContext _db;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<NewOrderHub, NewOrderHubClient> _newOrderHubContext;

        public SmsController(
            ILogger<SmsController> logger, 
            CydcContext db,
            IHttpContextAccessor httpContextAccessor,
            IHubContext<NewOrderHub, NewOrderHubClient> newOrderHubContext)
        {
            _logger = logger;
            _db = db;
            _httpContextAccessor = httpContextAccessor;
            _newOrderHubContext = newOrderHubContext;
        }

        [HttpPost, Route("/api/sms/on-message")]
        public async Task<IActionResult> OnMessage([FromBody] SmsResponseDto dto)
        {
            _logger.LogInformation(new EventId(1, "on-message-header"), JsonConvert.SerializeObject(Request.Headers));
            _logger.LogInformation(new EventId(2, "on-message-body"), ReadStream(Request.Body));
            _logger.LogInformation(new EventId(3, "on-message-dto"), JsonConvert.SerializeObject(dto));

            User user = await _db.Users.FirstOrDefaultAsync(x => x.PhoneNumber == dto.Mobile);
            if (user == null)
            {
                _logger.LogWarning("电话{0}未找到用户。", dto.Mobile);
                return BadRequest(string.Format("电话{0}未找到用户。", dto.Mobile));
            }

            FoodMenu menu = await _db.FoodMenu
                .OrderByDescending(x => x.Id)
                .Where(x => x.Enabled == true)
                .FirstOrDefaultAsync();
            if (menu == null)
            {
                _logger.LogWarning("电话{0}的用户{1}在非点餐时间点餐。", dto.Mobile, user.UserName);
                return BadRequest(string.Format("电话{0}的用户{1}在非点餐时间点餐。", dto.Mobile, user.UserName));
            }

            FoodOrder latestFoodOrder = await _db.FoodOrder
                .OrderByDescending(x => x.Id)
                .Where(x => x.OrderUserId == user.Id)
                .FirstOrDefaultAsync();
            
            var order = new FoodOrderCreateDto
            {
                AddressId = latestFoodOrder.LocationId, 
                Comment = "短信点餐", 
                IsMe = true, 
                MenuId = menu.Id, 
                TasteId = latestFoodOrder.TasteId, 
            };
            FoodOrder foodOrder = await order.Create(_db, user.Id, new FoodOrderClientInfo
            {
                Ip = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                UserAgent = $"{Request.Host}@{Request.Headers["User-Agent"]}"
            });
            await _newOrderHubContext.OnNewOrder(foodOrder.Id);
            return Ok();
        }

        private static string ReadStream(Stream stream)
        {
            using (var reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }
    }

    public class SmsResponseDto
    {
        public string Extend { get; set; }
        public string Mobile { get; set; }
        public string NationCode { get; set; }
        public string Sign { get; set; }
        public string Text { get; set; }
        public int Time { get; set; }
    }
}