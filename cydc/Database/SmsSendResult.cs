using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database
{
    public partial class SmsSendResult
    {
        [Key]
        public int SmsId { get; set; }
        [StringLength(50)]
        public string Sid { get; set; }
        public int ErrorCode { get; set; }
        [StringLength(200)]
        public string ErrorMessage { get; set; }
        [StringLength(200)]
        public string ExtensionMessage { get; set; }
        public byte Fee { get; set; }

        [ForeignKey(nameof(SmsId))]
        [InverseProperty(nameof(SmsSendLog.SmsSendResult))]
        public virtual SmsSendLog Sms { get; set; }
    }
}
