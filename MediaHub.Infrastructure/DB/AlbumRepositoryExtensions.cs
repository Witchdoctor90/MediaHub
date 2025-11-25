using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediaHub.Infrastructure.DB;

public static class AlbumRepositoryExtensions
{
    public static async Task<Album?> GetAlbumWithPhotos(this IRepository<Album> repository, Guid id)
    {
        return await repository
            .Query()
            .Include(a => a.Photos)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}