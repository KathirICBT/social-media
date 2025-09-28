using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class MembersController(AppDbContext context) : BaseApiController
    {
        [HttpGet] // http://localhost:5016/api/members
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await context.Users.ToListAsync();
            return members;
            // var members = context.Users.ToList();
            // return members;
            //return context.Users.ToList();
        }

        [HttpGet("{id}")] // http://localhost:5016/api/members/3
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await context.Users.FindAsync(id);
            if (member == null) return NotFound();
            return member;
            // var member = context.Users.Find(id);
            // if (member == null) return NotFound();            
            // return member;
            //return context.Users.FirstOrDefault(x => x.Id == id);
        }
    }
}
