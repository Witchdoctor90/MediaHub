namespace MediaHub.Entities;

public class Album
{
    public Guid Id { get; set; } = Guid.NewGuid();  
    public string Title { get; set; }

    public List<Photo> Photos { get; set; } = [];

    public Guid UserId { get; set; }   

    public Album()
    {
    }

    public Album(string title, Guid userId)
    {
        Title = title;
        UserId = userId;
    }
}