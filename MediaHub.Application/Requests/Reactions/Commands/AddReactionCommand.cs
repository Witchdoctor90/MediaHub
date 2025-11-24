using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Reactions.Commands;

public class AddReactionCommand(ReactionType type, Guid photoId, Guid userId) : IRequest<Reaction>
{
    public ReactionType Type { get; set; } = type;
    public Guid PhotoId { get; set; } = photoId;
    public Guid UserId { get; set; } = userId;
}

public class AddReactionCommandHandler(IRepository<Reaction> repository) : IRequestHandler<AddReactionCommand, Reaction>
{
    public async Task<Reaction> Handle(AddReactionCommand request, CancellationToken cancellationToken)
    {
        var reaction = new Reaction(request.Type, request.PhotoId, request.UserId);
        await repository.AddAsync(reaction);
        await repository.SaveChangesAsync(cancellationToken);
        return reaction;
    }
}