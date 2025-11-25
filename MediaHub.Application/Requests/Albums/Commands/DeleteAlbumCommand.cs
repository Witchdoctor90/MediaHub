using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class DeleteAlbumCommand(Guid id, Guid userId) : IRequest<bool>
{
    public Guid Id { get; set; } = id;
}

public class DeleteAlbumCommandHandler(IRepository<Album> _repository) : IRequestHandler<DeleteAlbumCommand, bool>
{
    public async Task<bool> Handle(DeleteAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id);
        if (entity is null) throw new KeyNotFoundException($"Album not found - {request.Id}");
        
        await _repository.DeleteAsync(entity.Id);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}