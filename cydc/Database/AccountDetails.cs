using System;

namespace cydc.Database
{
    public partial class AccountDetails
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreateTime { get; set; }
        public int? FoodOrderId { get; set; }
        public int UserId { get; set; }

        public virtual FoodOrder FoodOrder { get; set; }
        public virtual User User { get; set; }
    }
}
