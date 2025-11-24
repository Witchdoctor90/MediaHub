using System.Text;
using MediaHub.Application.Interfaces;
using MediaHub.Infrastructure.DB;
using MediaHub.Infrastructure.FileStorage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace MediaHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureDependencies(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<PostgresqlDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("SupabaseConnection")));
        services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 4;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedPhoneNumber = false;
            }).AddEntityFrameworkStores<PostgresqlDbContext>()
            .AddUserManager<UserManager<IdentityUser>>()
            .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"])),
                ValidateIssuer = false,
                ValidateAudience = false,
            };
        })
            .Services.AddAuthorization();
        
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        
        services.AddAzureClients(azureBuilder =>
        {
            azureBuilder.AddBlobServiceClient(configuration.GetConnectionString("AzureStorageConnection"));
        });
        services.AddSingleton<IPhotoManager, AzureBlobPhotoService>();
        return services;
    }
}