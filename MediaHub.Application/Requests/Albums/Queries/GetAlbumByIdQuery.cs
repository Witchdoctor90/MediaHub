using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Queries;

public class GetAlbumByIdQuery(Guid id) : IRequest<Album>
{
    public Guid Id { get; set; } = id;
}

public class GetAlbumByIdQueryHandler(IAlbumRepository repository) : IRequestHandler<GetAlbumByIdQuery, Album>
{
    public async Task<Album> Handle(GetAlbumByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await repository.GetAlbumWithPhotos(request.Id);
        return entity ?? throw new KeyNotFoundException($"Album not found - {request.Id}");
    }
}