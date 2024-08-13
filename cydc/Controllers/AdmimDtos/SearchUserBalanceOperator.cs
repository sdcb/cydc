using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cydc.Controllers.AdmimDtos;

public enum SearchUserBalanceOperator
{
    All = 0, 
    LessThanZero = 1, 
    EqualToZero = 2, 
    GreaterThanZero = 3, 
}
