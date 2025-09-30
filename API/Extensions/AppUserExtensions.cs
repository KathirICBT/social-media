using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;

public static class AppUserExtensions
{
    // Extension method to convert AppUser to UserDto
    public static UserDto ToDto(this AppUser user, ITokenService tokenService)
    {
        var token = tokenService.CreateToken(user); // CreateToken is a method in ITokenService interface
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Token = token
        };
    }
}
