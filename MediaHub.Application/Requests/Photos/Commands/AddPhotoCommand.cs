using MediaHub.Application.DTOs;
using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Commands;

public class AddPhotoCommand(FileBlob file, string description, Guid userId) : IRequest<Photo>
{
    public FileBlob File { get; set; } = file;
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