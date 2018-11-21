using System;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class FoodOrder
    {
        public FoodOrder()
        {
            AccountDetails = new HashSet<AccountDetails>();
        }

        public int Id { get; set; }
        public string Comment { get; set; }
        public int FoodMenuId { get; set; }
        public int LocationId { get; set; }
        public DateTime OrderTime { get; set; }
        public string OrderUserId { get; set; }
        public int TasteId { get; set; }

        public virtual FoodMenu FoodMenu { get; set; }
        public virtual Location Location { get; set; }
        public virtual AspNetUsers OrderUser { get; set; }
        public virtual TasteType Taste { get; set; }
        public virtual FoodOrderClientInfo FoodOrderClientInfo { get; set; }
        public virtual FoodOrderPayment FoodOrderPayment { get; set; }
        public virtual ICollection<AccountDetails> AccountDetails { get; set; }
    }
}
