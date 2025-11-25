using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class UpdateAlbumCommand(Album entity) : IRequest<Album>
{
    public Album Entity { get; set; } = entity;
}

public class UpdateAlbumCommandHandler(IRepository<Album> _repository) : IRequestHandler<UpdateAlbumCommand, Album>
{
    public async Task<Album> Handle(UpdateAlbumCommand request, CancellationToken cancellationToken)
    {
        if (await _repository.GetByIdAsync(request.Entity.Id) is null)
            throw new KeyNotFoundException($"Album not found - {request.Entity.Id}");
        
        await _repository.UpdateAsync(request.Entity);
        await _repository.SaveChangesAsync(cancellationToken);
        return request.Entity;
    }
}