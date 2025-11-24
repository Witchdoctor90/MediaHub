using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Queries;

public class GetPhotoFromAlbumQuery(Guid albumId) : IRequest<IEnumerable<Photo>>
{
    public Guid AlbumId { get; set; } = albumId;
}

public class GetPhotoFromAlbumQueryHandler(IRepository<Album> _repository) : IRequestHandler<GetPhotoFromAlbumQuery, IEnumerable<Photo>>
{
    public async Task<IEnumerable<Photo>> Handle(GetPhotoFromAlbumQuery request, CancellationToken cancellationToken)
    {
        var album = await _repository.FindAsync(a => a.Id == request.AlbumId);
        return !album.Any() 
            ? throw new KeyNotFoundException($"Album not found - {request.AlbumId}") 
            : album.First().Photos;
    }
}