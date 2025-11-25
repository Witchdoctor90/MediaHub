using MediaHub.Application.DTOs;
using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Reactions.Queries;

public class GetPhotoReactionsCountQuery(Guid photoId) : IRequest<ReactionsCountDto>
{
    public Guid PhotoId { get; set; } = photoId;
}

public class GetPhotoReactionsCountQueryHandler(IRepository<Reaction> repository) : IRequestHandler<GetPhotoReactionsCountQuery, ReactionsCountDto >
{
    public Task<ReactionsCountDto> Handle(GetPhotoReactionsCountQuery request, CancellationToken cancellationToken)
    {
        var query = repository.Query().Where(r => r.PhotoId == request.PhotoId);

        var likesCount = query.Count(r => r.ReactionType == ReactionType.Like);
        var dislikesCount = query.Count(r => r.ReactionType == ReactionType.Dislike);

        var result = new ReactionsCountDto
        {
            LikesCount = likesCount,
            DislikesCount = dislikesCount
        };

        return Task.FromResult(result);
    }
}