using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace cydc.Database
{
    public partial class AspNetUsers : IdentityUser
    {
        public AspNetUsers()
        {
            AccountDetails = new HashSet<AccountDetails>();
            AspNetUserClaims = new HashSet<IdentityUserClaim<string>>();
            AspNetUserLogins = new HashSet<IdentityUserLogin<string>>();
            AspNetUserRoles = new HashSet<IdentityUserRole<string>>();
            FoodOrder = new HashSet<FoodOrder>();
        }

        public virtual ICollection<AccountDetails> AccountDetails { get; set; }
        public virtual ICollection<IdentityUserClaim<string>> AspNetUserClaims { get; set; }
        public virtual ICollection<IdentityUserLogin<string>> AspNetUserLogins { get; set; }
        public virtual ICollection<IdentityUserRole<string>> AspNetUserRoles { get; set; }
        public virtual ICollection<FoodOrder> FoodOrder { get; set; }
    }
}
