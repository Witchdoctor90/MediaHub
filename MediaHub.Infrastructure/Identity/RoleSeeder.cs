using Microsoft.AspNetCore.Identity;

namespace MediaHub.Infrastructure.Identity;

public static class RoleSeeder
{
    private static readonly string[] Roles = new[] { "Admin", "User" };

    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        foreach (var role in Roles)
        {
            if(!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }
    }
}