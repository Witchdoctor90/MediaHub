using MediaHub.Application;
using MediaHub.Infrastructure;
using MediaHub.Infrastructure.DB;
using MediaHub.Presentation.Interfaces;
using MediaHub.Presentation.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.AzureAppServices;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();


builder.Services.AddLogging(lbuilder =>
{
    lbuilder.SetMinimumLevel(LogLevel.Trace);
    lbuilder.AddConsole();
});

builder.Logging.AddAzureWebAppDiagnostics();
builder.Services.Configure<AzureFileLoggerOptions>(options =>
{
    options.FileName = "log-";
    options.FileSizeLimit = 50 * 1024;
    options.RetainedFileCountLimit = 5;
});

builder.Services.AddInfrastructureDependencies(builder.Configuration);
builder.Services.AddApplicationDependencies();
builder.Services.AddControllers();

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUsersService, UsersService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PostgresqlDbContext>();
    db.Database.Migrate();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();

