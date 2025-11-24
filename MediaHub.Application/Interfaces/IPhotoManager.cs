
using MediaHub.Application.DTOs;
using MediaHub.Entities;

namespace MediaHub.Application.Interfaces;

public interface IPhotoManager
{
    public Task<string> UploadAsync(FileBlob file, CancellationToken cancellationToken = default);
    public Task RemoveAsync(Photo photo, CancellationToken cancellationToken = default);
}