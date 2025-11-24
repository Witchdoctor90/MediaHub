using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Commands;

public class UpdatePhotoCommand(Photo entity, Guid userId) : IRequest<Photo>
{
    public Photo Entity { get; set; } = entity;
    public Guid UserId { get; set; } = userId;
}

public class UpdatePhotoCommandHandler(IRepository<Photo> _repository) : IRequestHandler<UpdatePhotoCommand, Photo>
{
    public async Task<Photo> Handle(UpdatePhotoCommand request, CancellationToken cancellationToken)
    {
        if (request.Entity.UserId != request.UserId) throw new UnauthorizedAccessException();
        if (await _repository.GetByIdAsync(request.Entity.Id) is null)
            throw new KeyNotFoundException($"Photo not found - {request.Entity.Id}");

        return await _repository.UpdateAsync(request.Entity);
    }
}