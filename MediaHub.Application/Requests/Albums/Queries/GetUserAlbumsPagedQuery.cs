using System.Collections;
using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Queries;

public class GetUserAlbumsPagedQuery(Guid userId, int pageNum, int count) : IRequest<IEnumerable<Album>>
{
    public Guid UserId { get; set; } = userId;
    public int PageNum { get; set; } = pageNum;
    public int Count { get; set; } = count;
}

public class GetUserAlbumsPagedQueryHandler(IRepository<Album> _repository) : IRequestHandler<GetUserAlbumsPagedQuery, IEnumerable<Album>>
{
    public async Task<IEnumerable<Album>> Handle(GetUserAlbumsPagedQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetForUserAsyncPaged(request.UserId, request.PageNum, request.Count);
    }
}