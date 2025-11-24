namespace MediaHub.Entities;

public class Reaction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public ReactionType ReactionType { get; set; }

    public Guid PhotoId { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Reaction()
    {
    }

    public Reaction(ReactionType reactionType, Guid photoId, Guid userId)
    {
        ReactionType = reactionType;
        PhotoId = photoId;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
    }
}