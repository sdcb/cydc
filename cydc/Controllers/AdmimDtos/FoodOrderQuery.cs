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

        public string Comment { get; set; }

        public bool IsPayed { get; set; }
    }

    public class FoodOrderQuery : SortedPagedQuery
    {
        public string UserName { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public bool? IsPayed { get; set; }

        public override string GetDefaultSortString() => "Id DESC";

        public async Task<PagedResult<FoodOrderDto>> DoQuery(CydcContext db)
        {
            IQueryable<FoodOrderDto> query = db.FoodOrder
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
                }).ToSorted(this);

            if (!String.IsNullOrEmpty(UserName))
                query = query.Where(x => x.UserName.Contains(UserName));
            if (StartTime != null)
                query = query.Where(x => x.OrderTime >= StartTime.Value);
            if (EndTime != null)
                query = query.Where(x => x.OrderTime < EndTime.Value);
            if (IsPayed != null)
                query = query.Where(x => x.IsPayed == IsPayed.Value);

            return await query.ToPagedResultAsync(this);
        }
    }
}
