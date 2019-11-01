using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cydc.Database
{
    public partial class User : IdentityUser<int>
    {
        public User()
        {
            AccountDetails = new HashSet<AccountDetails>();
            UserClaims = new HashSet<IdentityUserClaim<int>>();
            UserLogins = new HashSet<IdentityUserLogin<int>>();
            UserRoles = new HashSet<IdentityUserRole<int>>();
            FoodOrder = new HashSet<FoodOrder>();
            SmsSendLogOperationUser = new HashSet<SmsSendLog>();
            SmsSendLogReceiveUser = new HashSet<SmsSendLog>();
        }

        [InverseProperty("User")]
        public virtual ICollection<AccountDetails> AccountDetails { get; set; }
        public virtual ICollection<IdentityUserClaim<int>> UserClaims { get; set; }
        public virtual ICollection<IdentityUserLogin<int>> UserLogins { get; set; }
        public virtual ICollection<IdentityUserRole<int>> UserRoles { get; set; }
        [InverseProperty("OrderUser")]
        public virtual ICollection<FoodOrder> FoodOrder { get; set; }
        [InverseProperty(nameof(SmsSendLog.OperationUser))]
        public virtual ICollection<SmsSendLog> SmsSendLogOperationUser { get; set; }
        [InverseProperty(nameof(SmsSendLog.ReceiveUser))]
        public virtual ICollection<SmsSendLog> SmsSendLogReceiveUser { get; set; }
    }
}
