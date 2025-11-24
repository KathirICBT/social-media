using System;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMetadata Metadata { get; set; } = default!;
    public List<T> Items { get; set; } = new List<T>();
}

public class PaginationMetadata
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}

public static class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query, int pageNumber, int pageSize)
    {
        // Defensive clamps (should already be handled by PagingParams)
        pageNumber = Math.Max(1, pageNumber);
        pageSize = Math.Max(1, pageSize);

        var count = await query.CountAsync();

        // calculate skip safely
        var skip = (pageNumber - 1) * pageSize;
        if (skip < 0) skip = 0;

        var items = await query
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<T>
        {
            Items = items,
            Metadata = new PaginationMetadata
            {
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = count,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            }
        };
    }
}


