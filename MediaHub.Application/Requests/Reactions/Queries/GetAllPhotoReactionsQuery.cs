using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Reactions.Queries;

public class GetAllPhotoReactionsQuery(Guid photoId) : IRequest<IEnumerable<Reaction>>
{
    public Guid PhotoId { get; set; } = photoId;
}

public class GetAllPhotoReactionsQueryHandler(IRepository<Reaction> _repository) : IRequestHandler<GetAllPhotoReactionsQuery, IEnumerable<Reaction>>
{
    public async Task<IEnumerable<Reaction>> Handle(GetAllPhotoReactionsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.FindAsync(r => r.PhotoId == request.PhotoId);
    }
}