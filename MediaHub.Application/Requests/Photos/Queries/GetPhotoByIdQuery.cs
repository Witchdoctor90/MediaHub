using MediaHub.Application.Interfaces;
using MediaHub.Entities;
using MediatR;

namespace MediaHub.Application.Requests.Photos.Queries;

public class GetPhotoByIdQuery(Guid id) : IRequest<Photo>
{
    public Guid Id { get; set; } = id;
}

public class GetPhotoByIdQueryHandler(IPhotoRepository _repository) : IRequestHandler<GetPhotoByIdQuery, Photo>
{
    public async Task<Photo> Handle(GetPhotoByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetPhotoWithReactions(request.Id);
    }
}
