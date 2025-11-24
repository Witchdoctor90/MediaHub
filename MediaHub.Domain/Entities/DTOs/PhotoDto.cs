namespace MediaHub.Entities.DTOs;

public class PhotoDto(string Title)
{
    public readonly Guid Id = Guid.Empty;
    public string Url { get; set; } = string.Empty;
}