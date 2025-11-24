namespace MediaHub.Entities;

public class Photo
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Url { get; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } =  DateTime.UtcNow;
    public Guid AlbumId { get; set; } = Guid.Empty;
    public List<Reaction> Reactions { get; set; } = [];

    public readonly Guid UserId = Guid.Empty;
}