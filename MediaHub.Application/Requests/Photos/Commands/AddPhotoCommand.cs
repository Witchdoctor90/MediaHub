using MediaHub.Application.DTOs;
using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Commands;

public class AddPhotoCommand(string filename, string contentType, Stream content, string description, Guid userId) : IRequest<Photo>
{
    public FileBlob File { get; set; }
    public string Description { get; set; } = description;
    public Guid UserId { get; set; } = userId;
}

public class AddPhotoCommandHandler(IRepository<Photo> _repository, IPhotoManager photoManager) : IRequestHandler<AddPhotoCommand, Photo>
{
    public async Task<Photo> Handle(AddPhotoCommand request, CancellationToken cancellationToken)
    {
        var url = await photoManager.UploadAsync(request.File, cancellationToken);
        var entity = new Photo(request.Description, url, request.UserId);
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync(cancellationToken);
        return entity;
    }
}