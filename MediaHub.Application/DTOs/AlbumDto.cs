namespace MediaHub.Application.DTOs;

public class AlbumDto
{
    public string Title { get; set; } = string.Empty;
    public Guid UserId { get; set; } = Guid.Empty;
}