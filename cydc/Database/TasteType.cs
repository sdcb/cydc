using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database;

public partial class TasteType
{
    public TasteType()
    {
        FoodOrder = new HashSet<FoodOrder>();
    }

    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(10)]
    public string Name { get; set; }
    public bool Enabled { get; set; }

    [InverseProperty("Taste")]
    public virtual ICollection<FoodOrder> FoodOrder { get; set; }
}
