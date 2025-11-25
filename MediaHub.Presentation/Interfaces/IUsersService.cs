using MediaHub.Presentation.Dto;
using Microsoft.AspNetCore.Identity;

namespace MediaHub.Presentation.Interfaces;

public interface IUsersService
{
    public Task<IdentityResult> Register(RegisterDto dto);
    public Task<string> JwtLogin(string username, string password);
    public Task<string> GetUsername(Guid id);
}