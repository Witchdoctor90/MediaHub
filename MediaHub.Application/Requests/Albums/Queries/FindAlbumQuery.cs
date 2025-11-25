using System.Linq.Expressions;
using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Queries;

public class FindAlbumQuery(Expression<Func<Album, bool>> predicate) : IRequest<IEnumerable<Album>>
{
    public Expression<Func<Album, bool>> predicate = predicate;
}

public class FindAlbumQueryHandler(IRepository<Album> _repository) : IRequestHandler<FindAlbumQuery, IEnumerable<Album>>
{
    public async Task<IEnumerable<Album>> Handle(FindAlbumQuery request, CancellationToken cancellationToken)
    {
        return await _repository.FindAsync(request.predicate);
    }
}