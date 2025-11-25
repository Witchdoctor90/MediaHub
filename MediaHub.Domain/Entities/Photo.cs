namespace MediaHub.Entities;

public class Photo : IBaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Url { get; set; }

    public string Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid? AlbumId { get; set; }    

    public List<Reaction> Reactions { get; set; } = [];

    public Guid UserId { get; set; }

    public Photo()
    {
    }

    public Photo(string description, string url, Guid userId)
    {
        Description = description;
        Url = url;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
    }
}