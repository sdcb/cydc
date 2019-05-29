using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

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
        }

        public virtual ICollection<AccountDetails> AccountDetails { get; set; }
        public virtual ICollection<IdentityUserClaim<int>> UserClaims { get; set; }
        public virtual ICollection<IdentityUserLogin<int>> UserLogins { get; set; }
        public virtual ICollection<IdentityUserRole<int>> UserRoles { get; set; }
        public virtual ICollection<FoodOrder> FoodOrder { get; set; }
    }
}
