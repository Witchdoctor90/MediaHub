using System.Security.Claims;
using MediaHub.Presentation.Dto;
using MediaHub.Presentation.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaHub.Presentation.Controllers;


[ApiController]
[Route("[controller]/[action]")]
public class AuthController : Controller
{
        private readonly ILogger<AuthController> _logger;
        private readonly IUsersService _usersService;

        public AuthController(ILogger<AuthController> logger, IUsersService usersService)
        {
            _logger = logger;
            _usersService = usersService;
        }

        [HttpGet]
        [Route("{id:guid}")]
        public async Task<IActionResult> GetUsername(Guid id)
        {
            return Ok(User.FindFirst(ClaimTypes.GivenName)?.Value);
        }
        
        [HttpGet]
        public async Task<IActionResult> GetUserInfo()
        {
            var result = new
            {
                email = User.FindFirst(ClaimTypes.Email)?.Value,
                username = User.FindFirst(ClaimTypes.GivenName)?.Value,
                id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            };
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                var result = await _usersService.Register(dto);
                if (!result.Succeeded) return BadRequest("Failed to register user");
                var token = await _usersService.JwtLogin(dto.Username, dto.Password);
                return Ok(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest("Failed to register user");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _usersService.JwtLogin(dto.Username, dto.Password);
                return Ok(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return BadRequest("Failed to login");
            }
        }
    
        
}