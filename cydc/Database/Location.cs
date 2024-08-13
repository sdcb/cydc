using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database;

public partial class Location
{
    public Location()
    {
        FoodOrder = new HashSet<FoodOrder>();
    }

    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(15)]
    public string Name { get; set; }
    public bool Enabled { get; set; }

    [InverseProperty("Location")]
    public virtual ICollection<FoodOrder> FoodOrder { get; set; }
}
