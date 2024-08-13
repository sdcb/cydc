using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database;

public partial class SmsSendLog
{
    [Key]
    public int Id { get; set; }
    public int TemplateId { get; set; }
    public int OperationUserId { get; set; }
    public int ReceiveUserId { get; set; }
    [Required]
    [StringLength(20)]
    public string ReceiveUserPhone { get; set; }
    [Required]
    [StringLength(4000)]
    public string Parameter { get; set; }
    public DateTime SendTime { get; set; }

    [ForeignKey(nameof(OperationUserId))]
    [InverseProperty(nameof(User.SmsSendLogOperationUser))]
    public virtual User OperationUser { get; set; }
    [ForeignKey(nameof(ReceiveUserId))]
    [InverseProperty(nameof(User.SmsSendLogReceiveUser))]
    public virtual User ReceiveUser { get; set; }
    [InverseProperty("Sms")]
    public virtual SmsSendResult SmsSendResult { get; set; }
}
