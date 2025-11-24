using MediaHub.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediaHub.Infrastructure.DB;

public class PostgresqlDbContext : DbContext
{
    public PostgresqlDbContext(DbContextOptions<PostgresqlDbContext> options) : base(options)
    {
    }
    
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Album> Albums { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
    
}