﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database;

public partial class FoodOrderClientInfo
{
    [Key]
    public int FoodOrderId { get; set; }
    [Required]
    [Column("IP")]
    [StringLength(15)]
    public string Ip { get; set; }
    [Required]
    public string UserAgent { get; set; }

    [ForeignKey(nameof(FoodOrderId))]
    [InverseProperty("FoodOrderClientInfo")]
    public virtual FoodOrder FoodOrder { get; set; }
}
