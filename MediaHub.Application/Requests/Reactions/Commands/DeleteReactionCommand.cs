using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Reactions.Commands;

public class DeleteReactionCommand(Guid id) : IRequest<bool>
{
    public Guid Id { get; set; } = id;
}

public class DeleteReactionCommandHandler(IRepository<Reaction> _repository) : IRequestHandler<DeleteReactionCommand, bool>
{
    public async Task<bool> Handle(DeleteReactionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id);
        if (entity is null) throw new KeyNotFoundException($"Reaction not found - {request.Id}");
        
        await _repository.DeleteAsync(entity.Id);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}