using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// Primary Constructor
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Member> Members { get; set; }
    public DbSet<Photo> Photos { get; set; }
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
