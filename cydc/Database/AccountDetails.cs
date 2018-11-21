using System;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class AccountDetails
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreateTime { get; set; }
        public int? FoodOrderId { get; set; }
        public string UserId { get; set; }

        public virtual FoodOrder FoodOrder { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
