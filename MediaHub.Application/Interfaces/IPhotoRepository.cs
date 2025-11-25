using MediaHub.Entities;

namespace MediaHub.Application.Interfaces;

public interface IPhotoRepository : IRepository<Photo>
{
    public Task<Photo> GetPhotoWithReactions(Guid id);
}