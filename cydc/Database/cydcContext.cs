using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace cydc.Database
{
    public partial class CydcContext : DbContext
    {
        public CydcContext()
        {
        }

        public CydcContext(DbContextOptions<CydcContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AccountDetails> AccountDetails { get; set; }
        public virtual DbSet<AspNetRoleClaims> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<FoodMenu> FoodMenu { get; set; }
        public virtual DbSet<FoodOrder> FoodOrder { get; set; }
        public virtual DbSet<FoodOrderClientInfo> FoodOrderClientInfo { get; set; }
        public virtual DbSet<FoodOrderPayment> FoodOrderPayment { get; set; }
        public virtual DbSet<Location> Location { get; set; }
        public virtual DbSet<SiteNotice> SiteNotice { get; set; }
        public virtual DbSet<TasteType> TasteType { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.0-preview3-35497");

            modelBuilder.Entity<AccountDetails>(entity =>
            {
                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.FoodOrder)
                    .WithMany(p => p.AccountDetails)
                    .HasForeignKey(d => d.FoodOrderId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AccountDetails)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_AccountDetails_ApplicationUser_UserId");
            });

            modelBuilder.Entity<AspNetRoleClaims>(entity =>
            {
                entity.Property(e => e.RoleId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_IdentityRoleClaim<string>_IdentityRole_RoleId");
            });

            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName)
                    .HasName("RoleNameIndex");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserClaims>(entity =>
            {
                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_IdentityUserClaim<string>_ApplicationUser_UserId");
            });

            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey })
                    .HasName("PK_IdentityUserLogin<string>");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_IdentityUserLogin<string>_ApplicationUser_UserId");
            });

            modelBuilder.Entity<AspNetUserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId })
                    .HasName("PK_IdentityUserRole<string>");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_IdentityUserRole<string>_IdentityRole_RoleId");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_IdentityUserRole<string>_ApplicationUser_UserId");
            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail)
                    .HasName("EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName)
                    .HasName("UserNameIndex");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);
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
                entity.HasKey(e => e.Id)
                    .ForSqlServerIsClustered(false);

                entity.HasIndex(e => e.OrderTime)
                    .ForSqlServerIsClustered();

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
