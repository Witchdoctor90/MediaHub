using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Queries;

public class GetAlbumsAsQueryableQuery : IRequest<IQueryable<Album>>
{
    
}

public class GetAlbumsAsQueryableQueryHandler(IRepository<Album> repository) : IRequestHandler<GetAlbumsAsQueryableQuery, IQueryable<Album>>
{
    public Task<IQueryable<Album>> Handle(GetAlbumsAsQueryableQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult(repository.Query());
    }
}