using MediaHub.Entities;

namespace MediaHub.Application.Interfaces;

public interface IAlbumRepository : IRepository<Album>
{
    public Task<Album> GetAlbumWithPhotos(Guid id);
}