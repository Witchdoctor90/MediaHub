using Microsoft.Extensions.DependencyInjection;

namespace MediaHub.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationDependencies(this IServiceCollection services)
    {
        services.AddMediatR(conf => conf.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
        return services;
    }
}