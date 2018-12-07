using cydc.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers.AdmimDtos
{
    public class UserBalanceSearchDto : PagedQuery
    {
        public string Name { get; set; }

        public SearchUserBalanceOperator Operator { get; set; } = SearchUserBalanceOperator.All;

        public Task<PagedResult<AdminUserDto>> DoQuery(CydcContext db)
        {
            IQueryable<AdminUserDto> query = db.AspNetUsers
               .Select(x => new AdminUserDto
               {
                   Id = x.Id,
                   Name = x.UserName,
                   Email = x.Email,
                   Balance = x.AccountDetails.Sum(a => a.Amount)
               });

            if (!string.IsNullOrWhiteSpace(Name))
                query = query.Where(x => x.Name.Contains(Name));
            query = ByOperator(query, Operator);

            return ToPagedResultAsync(query);
        }

        private static IQueryable<AdminUserDto> ByOperator(IQueryable<AdminUserDto> query, SearchUserBalanceOperator op)
        {
            switch (op)
            {
                case SearchUserBalanceOperator.All:
                    return query;
                case SearchUserBalanceOperator.LessThanZero:
                    return query.Where(x => x.Balance < 0).OrderBy(x => x.Balance);
                case SearchUserBalanceOperator.EqualToZero:
                    return query.Where(x => x.Balance == 0);
                case SearchUserBalanceOperator.GreaterThanZero:
                    return query.Where(x => x.Balance > 0).OrderByDescending(x => x.Balance);
                default:
                    throw new ArgumentOutOfRangeException(nameof(Operator));
            }
        }
    }

    public class PagedQuery
    {
        public int Page { get; set; } = 1;

        public int PageSize { get; set; } = 12;

        public int Skip => (Page - 1) * PageSize;

        public int Take => PageSize;

        public async Task<PagedResult<T>> ToPagedResultAsync<T>(IQueryable<T> query)
        {
            return new PagedResult<T>
            {
                PagedData = await query.Skip(Math.Max(0, Skip)).Take(Math.Min(Take, 100)).ToListAsync(),
                TotalCount = await query.CountAsync(),
            };
        }
    }

    public class PagedResult<T>
    {
        public List<T> PagedData { get; set; }
        public int TotalCount { get; set; }
    }
}
