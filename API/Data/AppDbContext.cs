using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// Primary Constructor
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
}
