using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MurrayDash.Models;

public partial class MurrayDashContext : DbContext
{
    public MurrayDashContext()
    {
    }

    public MurrayDashContext(DbContextOptions<MurrayDashContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Chore> Chores { get; set; }

    public virtual DbSet<ChoreActivity> ChoreActivities { get; set; }

    public virtual DbSet<Config> Configs { get; set; }

    public virtual DbSet<Person> People { get; set; }

    public virtual DbSet<ChoreCalcs> ChoreCalc { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("name=murraydash");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chore>(entity =>
        {
            entity.ToTable("chore");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Abbrev)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("abbrev");
            entity.Property(e => e.Description)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.Detail)
                .IsUnicode(false)
                .HasColumnName("detail");
            entity.Property(e => e.ExpectedValuePerDay).HasColumnName("expected_value_per_day");
            entity.Property(e => e.HourValue).HasColumnName("hour_value");
            entity.Property(e => e.IdOwner).HasColumnName("id_owner");
            entity.Property(e => e.Purpose)
                .IsUnicode(false)
                .HasColumnName("purpose");

            entity.HasOne(d => d.IdOwnerNavigation).WithMany(p => p.Chores)
                .HasForeignKey(d => d.IdOwner)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_chore_people");
        });

        modelBuilder.Entity<ChoreActivity>(entity =>
        {
            entity.ToTable("chore_activity");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DateChore).HasColumnName("date_chore");
            entity.Property(e => e.IdChore).HasColumnName("id_chore");
            entity.Property(e => e.IdName).HasColumnName("id_name");

            entity.HasOne(d => d.IdChoreNavigation).WithMany(p => p.ChoreActivities)
                .HasForeignKey(d => d.IdChore)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_chore_activity_chore");

            entity.HasOne(d => d.IdNameNavigation).WithMany(p => p.ChoreActivities)
                .HasForeignKey(d => d.IdName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_chore_activity_people");
        });

        modelBuilder.Entity<Config>(entity =>
        {
            entity.ToTable("config");

            entity.HasIndex(e => e.Key, "UQ__config__DFD83CAF17633D04").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Key)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("key");
            entity.Property(e => e.Value)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("value");
        });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.ToTable("people");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<ChoreCalcs>(entity =>
        {
            entity.ToView("chore_calcs_vw");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TotalPoints).HasColumnName("total_points");
            entity.Property(e => e.PercentComplete).HasColumnName("percent_complete");
            entity.Property(e => e.DailyAverage).HasColumnName("daily_average");
            entity.Property(e => e.AverageLast7Days).HasColumnName("avg_last_7_days");
            entity.Property(e => e.DailyAvgNeeded).HasColumnName("daily_avg_needed");
            entity.Property(e => e.DaysAtCurrentRate).HasColumnName("days_at_current_rate");
            entity.Property(e => e.IsWinning).HasColumnName("is_winning");
            entity.Property(e => e.DateTo11k).HasColumnName("date_to_11k");
            entity.Property(e => e.AddisonTotal).HasColumnName("addison_total");
            entity.Property(e => e.SkylarTotal).HasColumnName("skylar_total");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
