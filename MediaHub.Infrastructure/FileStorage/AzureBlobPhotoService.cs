using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MediaHub.Application.DTOs;
using MediaHub.Application.Interfaces;
using MediaHub.Entities;

namespace MediaHub.Infrastructure.FileStorage;

public class AzureBlobPhotoService : IPhotoManager
{
    private readonly BlobContainerClient  _containerClient;
    private const string CONTAINER_NAME = "images";
    
    public AzureBlobPhotoService(BlobServiceClient blobClient)
    {
        _containerClient = blobClient.GetBlobContainerClient("images");
        _containerClient.CreateIfNotExists(PublicAccessType.Blob);
    }

    
    public async Task<string> UploadAsync(FileBlob file, CancellationToken cancellationToken = default)
    {
        var key = GenerateKey(file.FileName);
        var blobClient = _containerClient.GetBlobClient(key);
        
        await blobClient.UploadAsync(file.Content, new BlobHttpHeaders()
        {
            ContentType = file.ContentType
        }, cancellationToken: cancellationToken);
        return blobClient.Uri.AbsoluteUri;
    }

    public async Task RemoveAsync(Photo photo, CancellationToken cancellationToken = default)
    {
        var blobClient = _containerClient.GetBlobClient(GetKeyFromUrl(photo.Url)); 
        await blobClient.DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }
    
    private static string GenerateKey(string originalFileName)
    {
        var ext = Path.GetExtension(originalFileName);
        return $"{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid()}{ext}";
    }
    
    private string GetKeyFromUrl(string url)
    {
        var uri = new Uri(url);
        var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
        if (segments.Length < 2)
            throw new ArgumentException("Invalid blob URL format", nameof(url));
        return string.Join('/', segments, 1, segments.Length - 1);
    }
}