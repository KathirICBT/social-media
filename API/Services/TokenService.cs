using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        var tokenKey = config["TokenKey"] ?? throw new Exception("Token key not found"); //TODO: Add logging
        if (tokenKey.Length < 64)
            throw new Exception("Token key must be at least 64 characters long"); //TODO: Add logging
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)); // Create a symmetric security key from the token key stored in the configuration file. The key is converted to a byte array using UTF-8 encoding. The key is then wrapped in a SymmetricSecurityKey object.

        var claims = new List<Claim>
        {
            // new Claim(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id)

        };
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature); // Use HMAC SHA-512 algorithm for signing the token with the symmetric key and SHA-512 hash algorithm for hashing the key.
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token); // Write the token to a string and return it.
    }
}

// System.IdentityModel.Tokens.Jwt - *
// Microsoft.IdentityModel.Tokens - *
// Microsoft.IdentityModel.JsonWebTokens
// Microsoft.IdentityModel.Logging

// dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
// dotnet add package Microsoft.IdentityModel.Tokens