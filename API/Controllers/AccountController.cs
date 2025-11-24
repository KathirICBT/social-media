using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
  [HttpPost("register")] // http://localhost:5016/api/account/register
  public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
  {
    if (await UserExists(registerDto.Email)) return BadRequest("Email is already taken");
    using var hmac = new HMACSHA512();
    var user = new AppUser
    {
      Email = registerDto.Email,
      DisplayName = registerDto.DisplayName,
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
      PasswordSalt = hmac.Key,
      Member = new Member
      {
        DisplayName = registerDto.DisplayName,
        Gender = registerDto.Gender,
        City = registerDto.City,
        Country = registerDto.Country,
        DateOfBirth = registerDto.DateOfBirth,
      }
    };

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return user.ToDto(tokenService);
  }

  [HttpPost("login")] // http://localhost:5016/api/account/login
  public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
  {
    //var user = await context.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);
    var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);
    if (user == null) return Unauthorized("Invalid email address");

    using var hmac = new HMACSHA512(user.PasswordSalt);
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password)); // compute the hash of the password provided during login


    for (int i = 0; i < computedHash.Length; i++)
    {
      if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
    }

    // return new UserDto
    // {
    //   Id = user.Id,
    //   Email = user.Email,
    //   DisplayName = user.DisplayName,
    //   // ImageUrl = null, 
    //   Token = tokenService.CreateToken(user) // create a token for the user
    // };   

    return user.ToDto(tokenService); // return the user as a DTO with a token
    // return AppUserExtensions.ToDto(user, tokenService); // return the user as a DTO with a token
  }

  // dotnet ef database drop
  // dotnet ef database update

  private async Task<bool> UserExists(string email)
  {
    return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
  }

  // public async Task<ActionResult<AppUser>> Register(string email, string displayName, string password)
  // {
  //     using var hmac = new HMACSHA512();
  //     var user = new AppUser
  //     {
  //         Email = email,
  //         DisplayName = displayName,
  //         PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
  //         PasswordSalt = hmac.Key
  //     };

  //     context.Users.Add(user);
  //     await context.SaveChangesAsync();

  //     return user;
  // }
}

// http://localhost:5016/api/account/register

// http://localhost:5016/api/account/register?email=kathir@example.com&displayName=Kathir&password=P@ssw0rd123!

/*
{
  "email": "kathir@example.com",
  "displayName": "Kathir",
  "password": "P@ssw0rd123!"
}


{
  "email": "arun.ravi@example.org",
  "displayName": "Arun Ravi",
  "password": "Welcome2025#"
}

give me with empty string
{
  "email": "",
  "displayName": "",
  "password": ""
}

{
  "email": "test+demo@example.com",
  "displayName": "Test User",
  "password": "T3st!ng_P@ss"
}


{
  "email": "someone@mail.dev.example.com",
  "displayName": "Subdomain User",
  "password": "SubD0main#2025"
}



{
    "email": "shortpass@example.com",
  "displayName": "Shorty",
  "password": "12345"
}

{
  "email": "user123@example.com",
  "displayName": "User123",
  "password": "NumUser#2025"
}

*/
