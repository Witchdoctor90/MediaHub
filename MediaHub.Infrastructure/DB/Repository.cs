using System.Linq.Expressions;
using MediaHub.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediaHub.Infrastructure.DB;

public class Repository<T> : IRepository<T> where T : class, IBaseEntity
{
    private readonly PostgresqlDbContext _context;
    private readonly DbSet<T> _entities;

    public Repository(PostgresqlDbContext context)
    {
        _context = context;
        _entities = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _entities.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _entities.ToListAsync();
    }

    public async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize)
    {
        return await _entities
            .Skip((pageNumber-1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<T?> AddAsync(T entity)
    {
        await _entities.AddAsync(entity);
        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        var existingEntity = await _entities.FindAsync(entity.Id);
        _context.Entry<T>(existingEntity).CurrentValues.SetValues(entity);
        return existingEntity;
    }

    public Task UpdateRangeAsync(IEnumerable<T> entities)
    {
        _context.UpdateRange(entities);
        return Task.CompletedTask;
    }

    public async Task<Guid> DeleteAsync(Guid entityId)
    {
        var entity = await _entities.FindAsync(entityId);
        _entities.Remove(entity);
        return entityId;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        var entity = await _entities.FindAsync(id);
        return entity is not null;
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _entities
            .Where(predicate)
            .ToListAsync();
    }

    public async Task<IEnumerable<T>> FindAsyncPaged(Expression<Func<T, bool>> predicate, int pageNumber, int pageSize)
    {
        return await _entities
            .Where(predicate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }

    public IQueryable<T> Query()
    {
        return _entities.AsQueryable();
    }

}