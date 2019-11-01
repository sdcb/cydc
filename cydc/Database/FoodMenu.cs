using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database
{
    public partial class FoodMenu
    {
        public FoodMenu()
        {
            FoodOrder = new HashSet<FoodOrder>();
        }

        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Details { get; set; }
        public bool Enabled { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }
        [Required]
        [StringLength(10)]
        public string Title { get; set; }
        public DateTime CreateTime { get; set; }

        [InverseProperty("FoodMenu")]
        public virtual ICollection<FoodOrder> FoodOrder { get; set; }
    }
}
