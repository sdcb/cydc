using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System;
using System.Linq;
using System.Reflection;

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
        public virtual DbSet<TasteType> TasteType { get; set; }

        public int? DatePart(string datePartArg, DateTime? date) => throw new Exception();

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
                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UserId)
                    .IsRequired();

                entity.HasOne(d => d.FoodOrder)
                    .WithMany(p => p.AccountDetails)
                    .HasForeignKey(d => d.FoodOrderId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AccountDetails)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_AccountDetails_ApplicationUser_UserId");
            });

            modelBuilder.Entity<FoodMenu>(entity =>
            {
                entity.Property(e => e.CreateTime).HasDefaultValueSql("('0001-01-01 00:00:00.0000000')");

                entity.Property(e => e.Details)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<FoodOrder>(entity =>
            {
                entity.HasKey(e => e.Id).IsClustered(false);

                entity.HasIndex(e => e.OrderTime).IsClustered();

                entity.Property(e => e.Comment).HasMaxLength(100);

                entity.Property(e => e.OrderUserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.FoodMenu)
                    .WithMany(p => p.FoodOrder)
                    .HasForeignKey(d => d.FoodMenuId);

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.FoodOrder)
                    .HasForeignKey(d => d.LocationId);

                entity.HasOne(d => d.OrderUser)
                    .WithMany(p => p.FoodOrder)
                    .HasForeignKey(d => d.OrderUserId)
                    .HasConstraintName("FK_FoodOrder_ApplicationUser_OrderUserId");

                entity.HasOne(d => d.Taste)
                    .WithMany(p => p.FoodOrder)
                    .HasForeignKey(d => d.TasteId);
            });

            modelBuilder.Entity<FoodOrderClientInfo>(entity =>
            {
                entity.HasKey(e => e.FoodOrderId);

                entity.Property(e => e.FoodOrderId).ValueGeneratedNever();

                entity.Property(e => e.Ip)
                    .IsRequired()
                    .HasColumnName("IP")
                    .HasMaxLength(15);

                entity.Property(e => e.UserAgent).IsRequired();

                entity.HasOne(d => d.FoodOrder)
                    .WithOne(p => p.FoodOrderClientInfo)
                    .HasForeignKey<FoodOrderClientInfo>(d => d.FoodOrderId);
            });

            modelBuilder.Entity<FoodOrderPayment>(entity =>
            {
                entity.HasKey(e => e.FoodOrderId);

                entity.Property(e => e.FoodOrderId).ValueGeneratedNever();

                entity.HasOne(d => d.FoodOrder)
                    .WithOne(p => p.FoodOrderPayment)
                    .HasForeignKey<FoodOrderPayment>(d => d.FoodOrderId);
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(15);
            });

            modelBuilder.Entity<SiteNotice>(entity =>
            {
                entity.Property(e => e.Content)
                    .IsRequired()
                    .HasMaxLength(500);
            });

            modelBuilder.Entity<TasteType>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(10);
            });
        }
    }
}
