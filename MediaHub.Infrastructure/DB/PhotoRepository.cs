using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediaHub.Infrastructure.DB;

public class PhotoRepository(PostgresqlDbContext context) : Repository<Photo>(context), IPhotoRepository
{
    public async Task<Photo> GetPhotoWithReactions(Guid id)
    {
        var entity = await context.Photos
            .Include(p => p.Reactions)
            .FirstAsync(p => p.Id == id);
        return entity ?? throw new KeyNotFoundException($"Photo not found - {id}");
    }
}