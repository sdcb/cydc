using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database
{
    public partial class FoodOrder
    {
        public FoodOrder()
        {
            AccountDetails = new HashSet<AccountDetails>();
        }

        [Key]
        public int Id { get; set; }
        [StringLength(100)]
        public string Comment { get; set; }
        public int FoodMenuId { get; set; }
        public int LocationId { get; set; }
        public DateTime OrderTime { get; set; }
        public int OrderUserId { get; set; }
        public int TasteId { get; set; }

        [ForeignKey(nameof(FoodMenuId))]
        [InverseProperty("FoodOrder")]
        public virtual FoodMenu FoodMenu { get; set; }
        [ForeignKey(nameof(LocationId))]
        [InverseProperty("FoodOrder")]
        public virtual Location Location { get; set; }
        [ForeignKey(nameof(OrderUserId))]
        [InverseProperty(nameof(User.FoodOrder))]
        public virtual User OrderUser { get; set; }
        [ForeignKey(nameof(TasteId))]
        [InverseProperty(nameof(TasteType.FoodOrder))]
        public virtual TasteType Taste { get; set; }
        [InverseProperty("FoodOrder")]
        public virtual FoodOrderClientInfo FoodOrderClientInfo { get; set; }
        [InverseProperty("FoodOrder")]
        public virtual FoodOrderPayment FoodOrderPayment { get; set; }
        [InverseProperty("FoodOrder")]
        public virtual ICollection<AccountDetails> AccountDetails { get; set; }
    }
}
