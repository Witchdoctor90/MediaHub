using System.Security.Claims;
using MediaHub.Application.DTOs;
using MediaHub.Application.Requests.Photos.Commands;
using MediaHub.Application.Requests.Photos.Queries;
using MediaHub.Application.Requests.Reactions.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaHub.Presentation.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class PhotoController(ILogger<PhotoController> logger, IMediator mediator) : Controller
{
    [HttpGet]
    [Route("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetPhotoByIdQuery(id);
        var result = await mediator.Send(query);
        return Ok(result);
    }


    [HttpGet]
    [Route("{page:int}/{perPage:int}")]
    public async Task<IActionResult> GetPaged(int page, int perPage)
    {
        var query = new GetAllPhotosPagedQuery(page, perPage);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    [Route("{page:int}/{perPage:int}")]
    public async Task<IActionResult> GetForUserPaged(int page, int perPage)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();

        var query = new GetUserPhotosPagedQuery(page, perPage, userGuid);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet]
    [Route("{albumId:guid}/{page:int}/{pageSize:int}")]
    public async Task<IActionResult> GetForAlbumPaged(Guid albumId, int page, int pageSize)
    {
        var query = new GetPhotosForAlbumPagedQuery(albumId, page, pageSize);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet]
    [Route("{id:guid}")]
    public async Task<IActionResult> GetReactionsCount(Guid id)
    {
        var query = new GetPhotoReactionsCountQuery(id);
        var result = await mediator.Send(query);
        return Ok(result);
    }
    
    [HttpPost]
    [Authorize]
    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> Add([FromForm] IFormFile file, [FromForm] string description)
    {
        if (file.Length == 0) return BadRequest();
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        
        var fileBlob = new FileBlob(file.OpenReadStream(), file.FileName, file.ContentType);
        var command = new AddPhotoCommand(fileBlob, description, userGuid);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    [Route("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Remove(Guid id)
    {
        if (!Guid.TryParse(User.FindFirstValue("Id"), out var userGuid)) return Unauthorized();
        var entity = await mediator.Send(new GetPhotoByIdQuery(id));
        if (entity.UserId != userGuid && !User.IsInRole("Admin")) return Unauthorized();

        var command = new DeletePhotoCommand(id);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}