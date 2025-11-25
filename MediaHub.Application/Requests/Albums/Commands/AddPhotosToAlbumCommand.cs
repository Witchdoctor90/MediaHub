using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class AddPhotosToAlbumCommand(IEnumerable<Guid> photoIds, Guid id) : IRequest<Album>
{
    public IEnumerable<Guid> PhotoIds { get; set; } = photoIds;
    public Guid Id { get; set; } = id;
}

public class AddPhotosToAlbumCommandHandler(IRepository<Photo> PhotoRepository, IRepository<Album> albumRepository) : IRequestHandler<AddPhotosToAlbumCommand, Album>
{
    public async Task<Album> Handle(AddPhotosToAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await albumRepository.GetByIdAsync(request.Id);
        if (album is null) throw new KeyNotFoundException($"Album not found - {request.Id}");

        var photos = await PhotoRepository.FindAsync(p
            => request.PhotoIds.Contains(p.Id));

        foreach (var photo in photos)
            photo.AlbumId = request.Id;
        await PhotoRepository.UpdateRangeAsync(photos);
        await PhotoRepository.SaveChangesAsync(cancellationToken);
        return album;
    }
    
}