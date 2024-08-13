using cydc.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;

namespace cydc.Controllers.AdmimDtos;

public class AdminUserDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public int OrderCount { get; set; }
    public decimal Balance { get; set; }
}

public class AdminUserQuery : SortedPagedQuery
{
    public string Name { get; set; }

    public string Email { get; set; }

    public string Phone { get; set; }

    public SearchUserBalanceOperator Operator { get; set; } = SearchUserBalanceOperator.All;

    public override string GetDefaultSortString() => "Id DESC";

    public Task<PagedResult<AdminUserDto>> DoQuery(CydcContext db)
    {
        IQueryable<AdminUserDto> query = db.Users
           .Select(x => new AdminUserDto
           {
               Id = x.Id,
               Name = x.UserName,
               Email = x.Email,
               Phone = x.PhoneNumber, 
               Balance = x.AccountDetails.Sum(a => a.Amount), 
               OrderCount = x.FoodOrder.Count, 
           }).ToSorted(this);

        if (!string.IsNullOrWhiteSpace(Name))
            query = query.Where(x => x.Name.Contains(Name));
        if (!string.IsNullOrWhiteSpace(Email))
            query = query.Where(x => x.Email.Contains(Email));
        if (!string.IsNullOrWhiteSpace(Phone))
            query = query.Where(x => x.Phone.Contains(Phone));
        query = ByOperator(query, Operator);

        return query.ToPagedResultAsync(this);
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
}

public static class PagedQueryExtensions
{
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(this IQueryable<T> query, PagedQuery pagedQuery)
    {
        return new PagedResult<T>
        {
            PagedData = await query.Skip(Math.Max(0, pagedQuery.Skip)).Take(Math.Min(pagedQuery.Take, 100)).ToListAsync(),
            TotalCount = await query.CountAsync(),
        };
    }
}

public class PagedResult<T>
{
    public List<T> PagedData { get; set; }
    public int TotalCount { get; set; }
}

public abstract class SortedPagedQuery : PagedQuery
{
    public string Sort { get; set; }

    public string Direction { get; set; }

    public string GetSortString() => Sort + " " + Direction;

    public virtual string GetDefaultSortString() => null;
}

public static class SortedPagedQueryExtensions
{
    public static IQueryable<T> ToSorted<T>(this IQueryable<T> query, SortedPagedQuery sortedPagedQuery)
    {
        if (!String.IsNullOrEmpty(sortedPagedQuery.Direction))
        {
            return query.OrderBy(sortedPagedQuery.GetSortString());
        }
        else if (sortedPagedQuery.GetDefaultSortString() != null)
        {
            return query.OrderBy(sortedPagedQuery.GetDefaultSortString());
        }
        else
        {
            return query;
        }
    }
}
