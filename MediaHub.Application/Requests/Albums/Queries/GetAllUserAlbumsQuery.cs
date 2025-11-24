using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Queries;

public class GetAllUserAlbumsQuery(Guid userId) : IRequest<IEnumerable<Album>>
{
    public Guid UserId { get; set; } = userId;
}

public class GetAllUserAlbumsQueryHandler(IRepository<Album> _repository) : IRequestHandler<GetAllUserAlbumsQuery, IEnumerable<Album>>
{
    public async Task<IEnumerable<Album>> Handle(GetAllUserAlbumsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.FindAsync(a => a.UserId == request.UserId);
    }
}