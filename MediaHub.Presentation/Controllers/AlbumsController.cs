using System.Security.Claims;
using MediaHub.Application.DTOs;
using MediaHub.Application.Requests.Albums.Commands;
using MediaHub.Application.Requests.Albums.Queries;
using MediaHub.Application.Requests.Photos.Queries;
using MediaHub.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaHub.Presentation.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class AlbumsController(ILogger<AlbumsController> logger, IMediator mediator) : Controller
{
    [HttpGet]
    public async Task<IActionResult> GetById([FromQuery]Guid id)
    {
        logger.LogTrace("Incoming GetById Request \n Id: {id}", id);

        var query = new GetAlbumByIdQuery(id);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAllForUser()
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        
        var query = new GetAllUserAlbumsQuery(userGuid);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var query = new GetAllAlbumsQuery();
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> FindByTitle(string title)
    {
        var query = new FindAlbumQuery(a => a.Title == title);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] string title)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        
        var command = new AddAlbumCommand(title, userGuid);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> Remove(Guid id)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        var entity = await mediator.Send(new GetAlbumByIdQuery(id));
        if (entity.UserId != userGuid && !User.IsInRole("Admin")) return new UnauthorizedResult();
        
        var command = new DeleteAlbumCommand(id, userGuid);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Album album)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        var entity = await mediator.Send(new GetAlbumByIdQuery(album.Id));
        if (entity.UserId != userGuid && !User.IsInRole("Admin")) return new UnauthorizedResult();
        
        var command = new UpdateAlbumCommand(album);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> AddPhotos([FromBody] List<Guid> photoIds, Guid id)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        var entity = await mediator.Send(new GetAlbumByIdQuery(id));
        if (entity.UserId != userGuid && !User.IsInRole("Admin")) return new UnauthorizedResult();

        var command = new AddPhotosToAlbumCommand(photoIds, id);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpPut]
    [Route("{id:guid}")]
    public async Task<IActionResult> RemovePhotos([FromBody] IEnumerable<Guid> photoIds, Guid id)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        var entity = await mediator.Send(new GetAlbumByIdQuery(id));
        if (entity.UserId != userGuid && !User.IsInRole("Admin")) return new UnauthorizedResult();

        var command = new RemovePhotosFromAlbumCommand(photoIds, id);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}

