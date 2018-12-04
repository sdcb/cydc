using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using cydc.Controllers.AdmimDtos;
using cydc.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cydc.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly CydcContext _db;

        public AdminController(CydcContext db)
        {
            _db = db;
        }

        public IActionResult Users(UserBalanceSearchDto searchDto, int skip = 0, int take = 12)
        {
            IQueryable<AdminUserDto> query = _db.AspNetUsers
                .Select(x => new AdminUserDto
                {
                    Id = x.Id, 
                    Name = x.UserName, 
                    Email = x.Email, 
                    Balance = x.AccountDetails.Sum(a => a.Amount)
                })
                .Skip(skip)
                .Take(Math.Min(100, take))
                .OrderByDescending(x => x.Balance);

            if (!string.IsNullOrWhiteSpace(searchDto.Name))
                query = query.Where(x => x.Name.Contains(searchDto.Name));
            switch (searchDto.Operator)
            {
                case SearchUserBalanceOperator.All:
                    return Ok(query);
                case SearchUserBalanceOperator.LessThanZero:
                    return Ok(query.Where(x => x.Balance < 0));
                case SearchUserBalanceOperator.EqualToZero:
                    return Ok(query.Where(x => x.Balance == 0));
                case SearchUserBalanceOperator.GreaterThanZero:
                    return Ok(query.Where(x => x.Balance > 0));
                default:
                    throw new ArgumentOutOfRangeException(nameof(searchDto.Operator));
            }
        }
    }
}