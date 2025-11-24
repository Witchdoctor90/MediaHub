using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Queries;

public class GetAllAlbumsQuery : IRequest<IEnumerable<Album>>
{
    
}

public class GetAllAlbumsQueryHandler(IRepository<Album> _repository) : IRequestHandler<GetAllAlbumsQuery, IEnumerable<Album>>
{
    public async Task<IEnumerable<Album>> Handle(GetAllAlbumsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetAllAsync();
    }
}