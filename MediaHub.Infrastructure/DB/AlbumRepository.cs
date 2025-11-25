using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediaHub.Infrastructure.DB;

public class AlbumRepository(PostgresqlDbContext context) : Repository<Album>(context), IAlbumRepository
{
    public async Task<Album> GetAlbumWithPhotos(Guid id)
    {
        var entity = await context.Albums
            .Include(a => a.Photos)
            .FirstAsync(a => a.Id == id);
        return entity ?? throw new KeyNotFoundException($"Album Not Found - {id}");
    }
}