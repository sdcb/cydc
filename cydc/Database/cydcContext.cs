using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace cydc.Database
{
    public partial class CydcContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public CydcContext()
        {
        }

        public CydcContext(DbContextOptions<CydcContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AccountDetails> AccountDetails { get; set; }
        public virtual DbSet<FoodMenu> FoodMenu { get; set; }
        public virtual DbSet<FoodOrder> FoodOrder { get; set; }
        public virtual DbSet<FoodOrderClientInfo> FoodOrderClientInfo { get; set; }
        public virtual DbSet<FoodOrderPayment> FoodOrderPayment { get; set; }
        public virtual DbSet<Location> Location { get; set; }
        public virtual DbSet<SiteNotice> SiteNotice { get; set; }
        public virtual DbSet<SmsSendLog> SmsSendLog { get; set; }
        public virtual DbSet<SmsSendResult> SmsSendResult { get; set; }
        public virtual DbSet<TasteType> TasteType { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IdentityUserRole<int>>().ToTable("UserRole");
            modelBuilder.Entity<IdentityRole<int>>().ToTable("Role");
            modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaim");
            modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("UserClaim");
            modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("UserLogin");
            modelBuilder.Entity<User>()
               .ToTable("User")
               .HasMany(e => e.UserClaims)
               .WithOne()
               .HasForeignKey(e => e.UserId)
               .IsRequired()
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(e => e.UserLogins)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(e => e.UserRoles)
                .WithOne()
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AccountDetails>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.AccountDetails)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_AccountDetails_ApplicationUser_UserId");
            });

            modelBuilder.Entity<FoodMenu>(entity =>
            {
                entity.Property(e => e.CreateTime).HasDefaultValueSql("('0001-01-01 00:00:00.0000000')");
            });

            modelBuilder.Entity<FoodOrder>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .IsClustered(false);

                entity.HasIndex(e => e.OrderTime)
                    .IsClustered();

                entity.HasOne(d => d.OrderUser)
                    .WithMany(p => p.FoodOrder)
                    .HasForeignKey(d => d.OrderUserId)
                    .HasConstraintName("FK_FoodOrder_ApplicationUser_OrderUserId");
            });

            modelBuilder.Entity<FoodOrderClientInfo>(entity =>
            {
                entity.Property(e => e.FoodOrderId).ValueGeneratedNever();
            });

            modelBuilder.Entity<FoodOrderPayment>(entity =>
            {
                entity.Property(e => e.FoodOrderId).ValueGeneratedNever();
            });

            modelBuilder.Entity<SmsSendLog>(entity =>
            {
                entity.HasKey(e => e.Id)
                    .IsClustered(false);

                entity.Property(e => e.ReceiveUserPhone).IsUnicode(false);

                entity.HasOne(d => d.OperationUser)
                    .WithMany(p => p.SmsSendLogOperationUser)
                    .HasForeignKey(d => d.OperationUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SmsSendLog_OperationUser");

                entity.HasOne(d => d.ReceiveUser)
                    .WithMany(p => p.SmsSendLogReceiveUser)
                    .HasForeignKey(d => d.ReceiveUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SmsSendLog_ReceiveUser");
            });

            modelBuilder.Entity<SmsSendResult>(entity =>
            {
                entity.HasKey(e => e.SmsId)
                    .HasName("PK_SmsResult");

                entity.HasIndex(e => e.Sid)
                    .HasName("IX_SmsResult")
                    .IsUnique();

                entity.Property(e => e.SmsId).ValueGeneratedNever();

                entity.Property(e => e.Sid).IsUnicode(false);

                entity.HasOne(d => d.Sms)
                    .WithOne(p => p.SmsSendResult)
                    .HasForeignKey<SmsSendResult>(d => d.SmsId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SmsResult_SmsSendLog");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
