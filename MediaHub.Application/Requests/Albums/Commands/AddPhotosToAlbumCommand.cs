using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class AddPhotosToAlbumCommand(List<Photo> photos, Guid id) : IRequest<Album>
{
    public List<Photo> Photos { get; set; } = photos;
    public Guid Id { get; set; } = id;
}

public class AddPhotosToAlbumCommandHandler(IRepository<Album> repository) : IRequestHandler<AddPhotosToAlbumCommand, Album>
{
    public async Task<Album> Handle(AddPhotosToAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = await repository.GetByIdAsync(request.Id);
        if (entity is null) throw new KeyNotFoundException($"Album not found - {request.Id}");
        entity.Photos.AddRange(request.Photos);
        await repository.UpdateAsync(entity);
        await repository.SaveChangesAsync(cancellationToken);
        return entity;
    }
}