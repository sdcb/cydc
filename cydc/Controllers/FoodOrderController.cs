﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Controllers.FoodOrders;
using cydc.Database;
using cydc.Hubs;
using cydc.Managers.Identities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace cydc.Controllers;

[Authorize]
public class FoodOrderController(
    CydcContext db,
    IHttpContextAccessor httpContextAccessor,
    IHubContext<NewOrderHub, NewOrderHubClient> newOrderHubContext) : Controller
{
    private readonly CydcContext _db = db;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
    private readonly IHubContext<NewOrderHub, NewOrderHubClient> _newOrderHubContext = newOrderHubContext;

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

        int? userId = await GetUserIdFromUserName(order.IsMe, order.OtherPersonName);
        if (userId == null)
        {
            return BadRequest($"User {order.OtherPersonName} cannot found.");
        }

        FoodOrder foodOrder = await order.Create(_db, userId.Value, new FoodOrderClientInfo
        {
            Ip = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
            UserAgent = $"{Request.Host}@{Request.Headers["User-Agent"]}"
        });
        await _newOrderHubContext.OnNewOrder(foodOrder.Id);

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    public async Task<FoodOrderDto> GetFoodOrder(int id)
    {
        return await FoodOrderDto.FromFoodOrder(_db.FoodOrder)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();
    }

    public IActionResult My()
    {
        int userId = int.Parse(User.GetUserId());
        return Ok(_db.FoodOrder
            .Where(x => x.OrderUserId == userId)
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
        int userId = int.Parse(User.GetUserId());
        decimal balance = await _db.AccountDetails
            .Where(x => x.UserId == userId)
            .SumAsync(x => x.Amount);
        return Ok(balance);
    }

    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SaveComment(int orderId, [FromBody]string comment)
    {
        FoodOrder order = await _db.FoodOrder.FindAsync(orderId);
        if (order.OrderUserId != int.Parse(User.GetUserId())) return Forbid();
        if (order.OrderTime < DateTime.Now.Date) return BadRequest("Order must be today.");

        order.Comment = comment;
        await _db.SaveChangesAsync();
        return Ok(order.Comment);
    }

    private async Task<int?> GetUserIdFromUserName(bool isMe, string userName)
    {
        if (isMe) return int.Parse(User.GetUserId());
        return (await _db.Users.FirstOrDefaultAsync(x => x.UserName == userName))?.Id;
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

    public async Task<int> MyLastTaste()
    {
        int userId = int.Parse(User.GetUserId());
        int tasteId = await _db.FoodOrder
            .OrderByDescending(x => x.Id)
            .Where(x => x.OrderUserId == userId)
            .Select(x => x.TasteId)
            .FirstOrDefaultAsync();
        return tasteId;
    }

    public async Task<int> MyLastLocation()
    {
        int userId = int.Parse(User.GetUserId());
        int locationId = await _db.FoodOrder
            .OrderByDescending(x => x.Id)
            .Where(x => x.OrderUserId == userId)
            .Select(x => x.LocationId)
            .FirstOrDefaultAsync();
        return locationId;
    }
}