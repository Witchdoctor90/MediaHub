using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class UpdateAlbumCommand(Album entity, Guid userId) : IRequest<Album>
{
    public Album Entity { get; set; } = entity;
    public Guid UserId { get; set; } = userId;
}

public class UpdateAlbumCommandHandler(IRepository<Album> _repository) : IRequestHandler<UpdateAlbumCommand, Album>
{
    public async Task<Album> Handle(UpdateAlbumCommand request, CancellationToken cancellationToken)
    {
        if (request.Entity.UserId != request.UserId) throw new UnauthorizedAccessException();
        if (await _repository.GetByIdAsync(request.Entity.Id) is null)
            throw new KeyNotFoundException($"Album not found - {request.Entity.Id}");

        return await _repository.UpdateAsync(request.Entity);
    }
}