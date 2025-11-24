using System.Linq.Expressions;
using MediaHub.Entities;

namespace MediaHub.Application.Interfaces;

public interface IRepository<T>
{
    public Task<T?> GetByIdAsync(Guid id);
    public Task<IEnumerable<T>> GetAllAsync();
    public Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize);
    public Task<T?> AddAsync(T entity);
    public Task<T> UpdateAsync(T entity);
    public Task<Guid> DeleteAsync(Guid entityId);
    public Task<bool> ExistsAsync(Guid id);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<IEnumerable<T>> FindAsyncPaged(Expression<Func<T, bool>> predicate, int pageNumber, int pageSize);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}