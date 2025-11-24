using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

// Primary Constructor
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Member> Members { get; set; }
    public DbSet<Photo> Photos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
           v => v.ToUniversalTime(),
           v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
       );

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}


// package Microsoft.EntityFrameworkCore
// Microsoft.EntityFrameworkCore.SqlServer
// Microsoft.EntityFrameworkCore.Tools
// Microsoft.EntityFrameworkCore.Design


// dotnet ef migrations add InitialCreate -outputDir Data/Migrations
// dotnet ef database update

// dotnet ef migrations remove
// dotnet ef database drop

// dotnet ef migrations add MemberEntityAdded 
// dotnet ef database update

// dotnet ef migrations add PhotoEntityUpdated
// dotnet ef migrations remove
