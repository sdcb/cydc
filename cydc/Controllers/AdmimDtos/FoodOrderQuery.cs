using cydc.Database;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers.AdmimDtos
{
    public class FoodOrderDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public DateTime OrderTime { get; set; }

        public string Menu { get; set; }

        public string Details { get; set; }

        public decimal Price { get; set; }

        public string Location { get; set; }

        public string Taste { get; set; }

        public string Comment { get; set; }

        public bool IsPayed { get; set; }

        public static IQueryable<FoodOrderDto> FromFoodOrder(IQueryable<FoodOrder> foodOrders)
        {
            return foodOrders.Select(foodOrder => new FoodOrderDto
            {
                Id = foodOrder.Id,
                UserName = foodOrder.OrderUser.UserName,
                OrderTime = foodOrder.OrderTime,
                Menu = foodOrder.FoodMenu.Title,
                Details = foodOrder.FoodMenu.Details,
                Price = foodOrder.FoodMenu.Price,
                Location = foodOrder.Location.Name,
                Taste = foodOrder.Taste.Name,
                Comment = foodOrder.Comment,
                IsPayed = foodOrder.FoodOrderPayment != null
            });
        }
    }

    public class FoodOrderQuery : SortedPagedQuery
    {
        public string UserName { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public bool? IsPayed { get; set; }

        public int? LocationId { get; set; }

        public int? TasteId { get; set; }

        public override string GetDefaultSortString() => "Id DESC";

        public async Task<PagedResult<FoodOrderDto>> DoQuery(CydcContext db)
        {
            IQueryable<FoodOrder> rawQuery = db.FoodOrder;

            if (!String.IsNullOrEmpty(UserName))
                rawQuery = rawQuery.Where(x => x.OrderUser.UserName.Contains(UserName));
            if (StartTime != null)
                rawQuery = rawQuery.Where(x => x.OrderTime >= StartTime.Value);
            if (EndTime != null)
                rawQuery = rawQuery.Where(x => x.OrderTime < EndTime.Value);
            if (IsPayed != null)
                rawQuery = rawQuery.Where(x => (x.FoodOrderPayment != null) == IsPayed.Value);
            if (LocationId != null)
                rawQuery = rawQuery.Where(x => x.LocationId == LocationId.Value);
            if (TasteId != null)
                rawQuery = rawQuery.Where(x => x.TasteId == TasteId.Value);

            var query = FoodOrderDto.FromFoodOrder(rawQuery).ToSorted(this);

            return await query.ToPagedResultAsync(this);
        }
    }
}
