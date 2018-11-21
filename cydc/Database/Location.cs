using System;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class Location
    {
        public Location()
        {
            FoodOrder = new HashSet<FoodOrder>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool Enabled { get; set; }

        public virtual ICollection<FoodOrder> FoodOrder { get; set; }
    }
}
