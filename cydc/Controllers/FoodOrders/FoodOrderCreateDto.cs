using System;
using System.Linq;
using System.Threading.Tasks;
using cydc.Database;
using Microsoft.EntityFrameworkCore;

namespace cydc.Controllers.FoodOrders;

public class FoodOrderCreateDto
{
    public int AddressId { get; set; }

    public int TasteId { get; set; }

    public int MenuId { get; set; }

    public bool IsMe { get; set; }

    public string OtherPersonName { get; set; }

    public string Comment { get; set; }

    public async Task<FoodOrder> Create(CydcContext db, int userId, FoodOrderClientInfo clientInfo)
    {
        FoodMenu menu = await db.FoodMenu.FindAsync(MenuId);
        DateTime dateNow = DateTime.Now;
        FoodOrder foodOrder = new()
        {
            OrderUserId = userId, 
            OrderTime = dateNow, 
            LocationId = AddressId, 
            FoodMenuId = MenuId, 
            TasteId = TasteId, 
            Comment = Comment, 
            FoodOrderClientInfo = clientInfo, 
        };
        foodOrder.AccountDetails.Add(new AccountDetails
        {
            UserId = userId,
            CreateTime = dateNow,
            Amount = -menu.Price
        });
        db.Add(foodOrder);
        await db.SaveChangesAsync();

        decimal amount = await db.AccountDetails.Where(x => x.UserId == userId).SumAsync(x => x.Amount);
        if (amount >= 0)
        {
            await AutoPay(db, foodOrder);
        }
        return foodOrder;
    }

    private async Task<int> AutoPay(CydcContext db, FoodOrder order)
    {
        order = await db.FoodOrder
            .Include(x => x.FoodOrderPayment)
            .SingleAsync(x => x.Id == order.Id);
        order.FoodOrderPayment = new FoodOrderPayment
        {
            PayedTime = DateTime.Now
        };
        return await db.SaveChangesAsync();
    }
}