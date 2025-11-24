using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Albums.Commands;

public class AddAlbumCommand(string title, Guid userId) : IRequest<Album>
{
    public string Title { get; set; } = title;
    public Guid UserId { get; set; } = userId;
}

public class AddAlbumCommandHandler(IRepository<Album> repository) : IRequestHandler<AddAlbumCommand, Album>
{
    public async Task<Album> Handle(AddAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = new Album(request.Title, request.UserId);
        await repository.AddAsync(album);
        await repository.SaveChangesAsync(cancellationToken);
        return album;
    }
}