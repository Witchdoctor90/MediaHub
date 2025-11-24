using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Queries;

public class GetAllPhotosPagedQuery(int pageNumber, int count) : IRequest<IEnumerable<Photo>>
{
    public int PageNumber { get; set; } = pageNumber;
    public int Count { get; set; } = count;
}

public class GetAllPhotosPagedQueryHandler(IRepository<Photo> _repository) : IRequestHandler<GetAllPhotosPagedQuery, IEnumerable<Photo>>
{
    public async Task<IEnumerable<Photo>> Handle(GetAllPhotosPagedQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetPagedAsync(request.PageNumber, request.Count);
    }
}