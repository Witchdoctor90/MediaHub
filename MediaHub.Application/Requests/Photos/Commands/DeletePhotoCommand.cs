using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Commands;

public class DeletePhotoCommand(Guid id) : IRequest<bool>
{
    public Guid Id { get; set; } = id;
}

public class DeletePhotoCommandHandler(IRepository<Photo> _repository, IPhotoManager _photoManager) : IRequestHandler<DeletePhotoCommand, bool>
{
    public async Task<bool> Handle(DeletePhotoCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id);
        if (entity is null) throw new KeyNotFoundException($"Photo not found - {request.Id}");

        await _photoManager.RemoveAsync(entity, cancellationToken);
        await _repository.DeleteAsync(entity.Id);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}