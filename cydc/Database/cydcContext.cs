﻿using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace cydc.Database
{
    public partial class CydcContext : IdentityDbContext<AspNetUsers, IdentityRole, string>
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
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
