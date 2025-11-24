namespace MediaHub.Entities;

public class Album(string Title, Guid UserId)
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public List<Photo> Photos { get; set; } = [];

    public readonly Guid UserId = Guid.Empty;
}