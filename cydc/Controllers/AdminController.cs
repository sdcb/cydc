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
using System.IO;
using OfficeOpenXml;
using System.Reflection;

namespace cydc.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController(
    CydcContext db,
    UserManager userManager) : Controller
{
    private readonly CydcContext _db = db;
    private readonly UserManager _userManager = userManager;

    public async Task<PagedResult<AdminUserDto>> Users(AdminUserQuery searchDto)
    {
        PagedResult<AdminUserDto> data = await searchDto.DoQuery(_db);
        foreach (AdminUserDto item in data.PagedData)
        {
            item.Phone = item.Phone switch
            {
                null => item.Phone,
                { Length: 11 } => item.Phone[..3] + "****" + item.Phone[^4..], 
                _ => item.Phone, 
            };
        }
        return data;
    }

    public async Task<PagedResult<FoodOrderDto>> Orders(FoodOrderQuery query)
    {
        return await query.DoQuery(_db);
    }

    public async Task<IActionResult> ExportOrders(FoodOrderQuery query)
    {
        PagedResult<FoodOrderDto> data = await query.DoQuery(_db);

        using MemoryStream stream = new();
        using ExcelPackage excel = new(stream);
        ExcelWorksheet sheet = excel.Workbook.Worksheets.Add("Sheet1");
        PropertyInfo[] props = typeof(FoodOrderDto).GetProperties();
        for (int i = 0; i < props.Length; ++i)
        {
            sheet.Cells[1, i + 1].Value = props[i].Name;
        }
        for (int i = 0; i < data.PagedData.Count; ++i)
        {
            for (int j = 0; j < props.Length; ++j)
            {
                object value = props[j].GetValue(data.PagedData[i]);
                sheet.Cells[i + 2, j + 1].Value = value;
                sheet.Cells[i + 2, j + 1].Style.Numberformat.Format = value?.GetType() switch
                {
                    var x when x == typeof(DateTime) => "yyyy-mm-dd",
                    _ => "General",
                };
            }
        }
        for (int i = 0; i < props.Length; ++i)
        {
            sheet.Column(i + 1).AutoFit();
        }
        excel.Save();

        string fileName = $"{query.StartTime?.ToString("yyyy-MM-dd") ?? "Excel"}.xlsx";
        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
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
        User user = await _userManager.FindByIdAsync(userId);
        string token = await _userManager.GeneratePasswordResetTokenAsync(user);
        Microsoft.AspNetCore.Identity.IdentityResult ok = await _userManager.ResetPasswordAsync(user, token, password);
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

        foreach (AccountDetails item in foodOrder.AccountDetails)
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

        FoodOrderPayment payment = new()
        {
            FoodOrderId = orderId,
            PayedTime = DateTime.Now,
        };
        _db.Entry(payment).State = EntityState.Added;

        AccountDetails accounting = new()
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
    public async Task<IActionResult> BatchPay([Required]int userId, [Required]decimal amount, [FromBody]int[] orderIds)
    {
        foreach (int orderId in orderIds)
        {
            FoodOrder foodOrder = await _db.FoodOrder
                            .Include(x => x.FoodOrderPayment)
                            .Include(x => x.AccountDetails)
                            .FirstOrDefaultAsync(x => x.Id == orderId);
            if (foodOrder.FoodOrderPayment != null) return BadRequest("Payment already exists.");
            if (foodOrder.AccountDetails.Sum(x => x.Amount) >= 0) return BadRequest("No amount exists.");

            FoodOrderPayment payment = new()
            {
                FoodOrderId = orderId,
                PayedTime = DateTime.Now,
            };
            _db.Entry(payment).State = EntityState.Added;
        }

        AccountDetails accounting = new()
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

    public async Task<int> GetUserIdByUserName(string userName)
    {
        userName = userName.Trim();
        return await _db.Users
            .Where(x => x.NormalizedUserName == userName)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();
    }
}