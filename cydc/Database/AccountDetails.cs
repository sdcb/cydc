using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database;

public partial class AccountDetails
{
    [Key]
    public int Id { get; set; }
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }
    public DateTime CreateTime { get; set; }
    public int? FoodOrderId { get; set; }
    public int UserId { get; set; }

    [ForeignKey(nameof(FoodOrderId))]
    [InverseProperty("AccountDetails")]
    public virtual FoodOrder FoodOrder { get; set; }
    [ForeignKey(nameof(UserId))]
    [InverseProperty("AccountDetails")]
    public virtual User User { get; set; }
}
