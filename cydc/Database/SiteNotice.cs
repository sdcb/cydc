using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database;

public partial class SiteNotice
{
    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(4000)]
    public string Content { get; set; }
}
