using System;

namespace API.DTOs;

public class LoginDto
{
    public string Email { get; set; } = ""; // default value is empty string
    public string Password { get; set; } = ""; // default value is empty string
}
