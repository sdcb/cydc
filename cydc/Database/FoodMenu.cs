using System;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class FoodMenu
    {
        public FoodMenu()
        {
            FoodOrder = new HashSet<FoodOrder>();
        }

        public int Id { get; set; }
        public string Details { get; set; }
        public bool Enabled { get; set; }
        public decimal Price { get; set; }
        public string Title { get; set; }
        public DateTime CreateTime { get; set; }

        public virtual ICollection<FoodOrder> FoodOrder { get; set; }
    }
}
