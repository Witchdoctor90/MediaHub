using MediaHub.Entities;

namespace MediaHub.Application.DTOs;

public class ReactionDto(ReactionType type, Guid photoId)
{
    public ReactionType Type { get; set; } = type;
    public Guid PhotoId { get; set; } = photoId;
}