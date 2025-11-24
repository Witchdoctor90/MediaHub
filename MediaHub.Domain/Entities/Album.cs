namespace MediaHub.Entities;

public class Album(string title, Guid userId)
{
    public Guid Id { get; } = userId;
    public string Title { get; set; } = title;
    public List<Photo> Photos { get; set; } = [];

    public readonly Guid UserId = Guid.Empty;
}