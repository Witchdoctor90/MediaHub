using MediaHub.Presentation.Dto;
using MediaHub.Presentation.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace MediaHub.Presentation.Services;

public class UsersService : IUsersService
{
    private readonly ITokenService _tokenService;
    private readonly UserManager<IdentityUser> _userManager;

    public UsersService(ITokenService tokenService, UserManager<IdentityUser> userManager)
    {
        _tokenService = tokenService;
        _userManager = userManager;
    }

    public async Task<IdentityResult> Register(RegisterDto dto)
    {
        return await _userManager.CreateAsync(new IdentityUser()
        {
            UserName = dto.Username,
            Email = dto.Email
        }, dto.Password);
    }

    public async Task<string> JwtLogin(string username, string password)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user is null || !await _userManager.CheckPasswordAsync(user, password)) 
            throw new KeyNotFoundException("Invalid username or password");

        return _tokenService.GenerateToken(user);
    }

    public async Task<string?> GetUsername(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        return user is not null ? user.UserName : throw new KeyNotFoundException($"User not found - {id}");
    }

}