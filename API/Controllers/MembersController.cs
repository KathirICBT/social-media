using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository, IPhotoService photoService) : BaseApiController
    {
        // [AllowAnonymous]
        [HttpGet] // http://localhost:5016/api/members
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers([FromQuery] MemberParams memberParams)
        {
            memberParams.CurrentMemberId = User.GetMemberId();
            return Ok(await memberRepository.GetMembersAsync(memberParams));
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

        // api/members/3/photos
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut] // http://localhost:5016/api/members
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();
            // var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // if (memberId == null) return BadRequest("Oops! - no id found in token");

            var member = await memberRepository.GetMemberForUpdateAsync(memberId);

            if (member == null) return BadRequest("Member not found");
            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memberRepository.Update(member); // optional

            if (await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var memberId = User.GetMemberId();
            var member = await memberRepository.GetMemberForUpdateAsync(memberId);

            if (member == null) return BadRequest("Member not found");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = memberId
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if (await memberRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")] // http://localhost:5016/api/members/set-main-photo/11
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var memberId = User.GetMemberId();
            var member = await memberRepository.GetMemberForUpdateAsync(memberId);

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null) return BadRequest("Cannot set this photo as main photo");

            if (member.ImageUrl == photo.Url)
                return BadRequest("This is already your main photo");

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")] // http://localhost:5016/api/members/delete-photo/11
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var memberId = User.GetMemberId();
            var member = await memberRepository.GetMemberForUpdateAsync(memberId);

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (member.ImageUrl == photo.Url)
                return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);

            if (await memberRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete photo");
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