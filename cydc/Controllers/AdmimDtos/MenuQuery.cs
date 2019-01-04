using cydc.Database;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers.AdmimDtos
{
    public class MenuDto
    {
        public int Id { get; set; }

        public DateTime CreateTime { get; set; }

        public string Name { get; set; }

        public string Details { get; set; }

        public decimal Price { get; set; }

        public bool Enabled { get; set; }

        public int OrderCount { get; set; }
    }

    public class MenuQuery : SortedPagedQuery
    {
        public string Details { get; set; }

        public decimal? Price { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public override string GetDefaultSortString() => "Id DESC";

        public async Task<PagedResult<MenuDto>> DoQuery(CydcContext db)
        {
            IQueryable<MenuDto> query = db.FoodMenu
                .Select(x => new MenuDto
                {
                    Id = x.Id, 
                    CreateTime = x.CreateTime, 
                    Details = x.Details, 
                    Name = x.Title, 
                    Enabled = x.Enabled, 
                    Price = x.Price, 
                    OrderCount = x.FoodOrder.Count, 
                }).ToSorted(this);

            if (!String.IsNullOrEmpty(Details))
                query = query.Where(x => x.Details.Contains(Details));
            if (Price != null)
                query = query.Where(x => x.Price == Price.Value);
            if (StartTime != null)
                query = query.Where(x => x.CreateTime >= StartTime.Value);
            if (EndTime != null)
                query = query.Where(x => x.CreateTime < EndTime.Value);

            return await query.ToPagedResultAsync(this);
        }
    }
}
