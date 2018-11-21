using System;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class FoodOrderClientInfo
    {
        public int FoodOrderId { get; set; }
        public string Ip { get; set; }
        public string UserAgent { get; set; }

        public virtual FoodOrder FoodOrder { get; set; }
    }
}
