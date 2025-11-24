namespace MediaHub.Entities;

public class Reaction
{
    public readonly Guid UserId =  Guid.Empty;
    public readonly Guid PhotoId = Guid.Empty;
    public readonly DateTime CreatedAt = DateTime.UtcNow;
    public readonly ReactionType ReactionType = ReactionType.Like;
}