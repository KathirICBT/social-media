using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet] // http://localhost:5016/api/members
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
            // var members = await context.Users.ToListAsync();
            // return members;
            // var members = context.Users.ToList();
            // return members;
            //return context.Users.ToList();
        }


        [HttpGet("{id}")] // http://localhost:5016/api/members/3
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            // var member = await context.Users.FindAsync(id);
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return member;
            // var member = context.Users.Find(id);
            // if (member == null) return NotFound();            
            // return member;
            //return context.Users.FirstOrDefault(x => x.Id == id);
        }


        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }
    }
}


// microsoft.aspnetcore.authentication.jwtbearer -*
// microsoft.aspnetcore.mvc


// Login info
// {
//   "email": "lisa@test.com",  
//   "password": "Pa$$w0rd"
// }