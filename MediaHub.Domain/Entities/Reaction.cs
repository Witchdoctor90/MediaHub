namespace MediaHub.Entities;

public class Reaction(ReactionType type, Guid photoId, Guid userId)
{
    public Guid Id { get; } = Guid.NewGuid();
    public readonly Guid UserId = userId;
    public readonly Guid PhotoId = photoId;
    public readonly DateTime CreatedAt = DateTime.UtcNow;
    public readonly ReactionType ReactionType = type;
}