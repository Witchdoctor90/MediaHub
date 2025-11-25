using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Reactions.Queries;

public class GetReactionByIdQuery(Guid id) : IRequest<Reaction>
{
    public Guid Id { get; set; } = id;
}

public class GetReactionByIdQueryHandler(IRepository<Reaction> repository) : IRequestHandler<GetReactionByIdQuery, Reaction>
{
    public async Task<Reaction> Handle(GetReactionByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await repository.GetByIdAsync(request.Id);
        return entity ?? throw new KeyNotFoundException($"Entity was not found {request.Id}");
    }
}