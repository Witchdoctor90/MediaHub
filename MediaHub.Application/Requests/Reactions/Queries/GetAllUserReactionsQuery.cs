using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Reactions.Queries;

public class GetAllUserReactionsQuery(Guid userId) : IRequest<IEnumerable<Reaction>>
{
    public Guid UserId { get; set; } = userId;
}

public class GetAllUserReactionsQueryHandler(IRepository<Reaction> _repository) : IRequestHandler<GetAllUserReactionsQuery, IEnumerable<Reaction>>
{
    public Task<IEnumerable<Reaction>> Handle(GetAllUserReactionsQuery request, CancellationToken cancellationToken)
    {
        return _repository.FindAsync(r => r.UserId == request.UserId);
    }
}