using System;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class FoodOrderPayment
    {
        public int FoodOrderId { get; set; }
        public DateTime PayedTime { get; set; }

        public virtual FoodOrder FoodOrder { get; set; }
    }
}
