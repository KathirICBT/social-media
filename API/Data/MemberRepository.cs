using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdateAsync(string id)
    {
        return await context.Members
            .Include(x => x.User)
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        // Ensure stable ordering before Skip/Take to avoid non-deterministic results
        var query = context.Members
                           .OrderBy(m => m.Id) // choose stable column; change if needed
                           .AsQueryable();

        query = query.Where(x => x.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender != null)
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string MemberId)
    {
        return await context.Members
            .Where(x => x.Id == MemberId)
            .SelectMany(x => x.Photos)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}

// Login info
// {
//   "email": "lisa@test.com",  
//   "password": "Pa$$w0rd"
// }
