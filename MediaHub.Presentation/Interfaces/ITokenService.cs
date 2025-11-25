using Microsoft.AspNetCore.Identity;

namespace MediaHub.Presentation.Interfaces;

public interface ITokenService
{
    string GenerateToken(IdentityUser user);
}