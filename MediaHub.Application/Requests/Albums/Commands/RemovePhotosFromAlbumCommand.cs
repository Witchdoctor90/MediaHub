using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class RemovePhotosFromAlbumCommand(IEnumerable<Guid> photoIds, Guid albumId) : IRequest<bool>
{
    public IEnumerable<Guid> PhotoIds { get; set; } = photoIds;
    public Guid AlbumId { get; set; } = albumId;
}

public class RemovePhotosFromAlbumCommandHandler(IRepository<Photo> repository) : IRequestHandler<RemovePhotosFromAlbumCommand, bool>
{
    public async Task<bool> Handle(RemovePhotosFromAlbumCommand request, CancellationToken cancellationToken)
    {
        var photos = (await repository.FindAsync(p
            => request.PhotoIds.Contains(p.Id)
               && p.AlbumId == request.AlbumId));

        foreach (var photo in photos)
            photo.AlbumId = null;
        
        await repository.UpdateRangeAsync(photos);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}