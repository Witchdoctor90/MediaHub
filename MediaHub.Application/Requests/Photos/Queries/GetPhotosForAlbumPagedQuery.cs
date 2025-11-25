using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Queries;

public class GetPhotosForAlbumPagedQuery(Guid albumId, int page, int pageSize) : IRequest<IEnumerable<Photo>>
{
    public Guid AlbumId { get; set; } = albumId;
    public int Page { get; set; } = page;
    public int PageSize { get; set; } = pageSize;
}

public class GetPhotosForAlbumPagedQueryHandler(IRepository<Photo> repository) : IRequestHandler<GetPhotosForAlbumPagedQuery, IEnumerable<Photo>>
{
    public async Task<IEnumerable<Photo>> Handle(GetPhotosForAlbumPagedQuery request, CancellationToken cancellationToken)
    {
        return await repository.FindAsyncPaged(p => p.AlbumId == request.AlbumId, request.Page, request.PageSize);
    }
}