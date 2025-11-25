using MediaHub.Application.Requests.Reactions.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MediaHub.Application.DTOs;
using MediaHub.Application.Requests.Reactions.Commands;
using Microsoft.AspNetCore.Authorization;

namespace MediaHub.Presentation.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ReactionsController(IMediator mediator, ILogger<ReactionsController> logger) : Controller
{

    [HttpGet]
    public async Task<IActionResult> GetAllForPhoto(Guid photoId)
    {
        logger.LogTrace("Incoming GetAll request");
        var query = new GetAllPhotoReactionsQuery(photoId);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllForUser()
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        logger.LogTrace("Incoming GetAll request: \n User: {userGuid}", userGuid);
        var query = new GetAllUserReactionsQuery(userGuid);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] ReactionDto dto)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        logger.LogTrace("Incoming Add request: \n User: {userGuid}", userGuid);
        var command = new AddReactionCommand(dto.Type, dto.PhotoId, userGuid);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> Remove([FromBody] Guid id)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        logger.LogTrace("Incoming Remove request: \n User:{userGuid}", userGuid);
        var entity = await mediator.Send(new GetReactionByIdQuery(id));
        if (userGuid != entity.UserId && !User.IsInRole("Admin")) return Unauthorized();
        
        var command = new DeleteReactionCommand(id);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}