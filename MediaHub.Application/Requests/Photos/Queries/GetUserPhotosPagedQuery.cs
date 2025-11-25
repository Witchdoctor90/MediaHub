using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Queries;

public class GetUserPhotosPagedQuery(int pageNum, int count, Guid userId) : IRequest<IEnumerable<Photo>>
{
    public int PageNum { get; set; } = pageNum;
    public int Count { get; set; } = count;
    public Guid UserId { get; set; } = userId;
}

public class GetUserPhotosPagedQueryHandler(IRepository<Photo> _repository) : IRequestHandler<GetUserPhotosPagedQuery, IEnumerable<Photo>>
{
    public async Task<IEnumerable<Photo>> Handle(GetUserPhotosPagedQuery request, CancellationToken cancellationToken)
    {
        return await _repository.FindAsyncPaged(p => p.UserId == request.UserId, request.PageNum, request.Count);
    }
}