using System.ComponentModel.DataAnnotations;

namespace cydc.Database;

public partial class SiteNotice
{
    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(4000)]
    public string Content { get; set; }
}
