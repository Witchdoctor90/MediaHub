namespace MediaHub.Application.DTOs;

public class FileBlob(Stream content, string fileName, string contentType)
{
    public string FileName { get; set; } = fileName;
    public string ContentType { get; set; } = contentType;
    public Stream Content { get; set; } = content;
}