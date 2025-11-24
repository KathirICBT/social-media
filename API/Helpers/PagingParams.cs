using System;
using Humanizer;

namespace API.Helpers;

public class PagingParams
{
    private const int MaxPageSize = 50;
    private int _pageNumber = 1;   // default page 1
    private int _pageSize = 10;    // default page size 10

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = (value < 1) ? 1 : value; // clamp minimum 1
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value < 1) ? 10 : Math.Min(value, MaxPageSize);
    }
}
