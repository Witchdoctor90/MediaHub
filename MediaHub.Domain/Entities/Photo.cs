namespace MediaHub.Entities;

public class Photo(string description, string url, Guid userId)
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Url { get; } = url;
    public string Description { get; set; } = description;
    public DateTime CreatedAt { get; set; } =  DateTime.UtcNow;
    public Guid? AlbumId { get; set; } = Guid.Empty;
    public List<Reaction> Reactions { get; set; } = [];

    public readonly Guid UserId = userId;
}