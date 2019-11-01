using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database
{
    public partial class FoodOrderPayment
    {
        [Key]
        public int FoodOrderId { get; set; }
        public DateTime PayedTime { get; set; }

        [ForeignKey(nameof(FoodOrderId))]
        [InverseProperty("FoodOrderPayment")]
        public virtual FoodOrder FoodOrder { get; set; }
    }
}
