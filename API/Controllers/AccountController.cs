using System.Security.Cryptography;
using API.Data;
using API.Entities;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using API.Extensions;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] // api/account/register
    // public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto) 
    public async Task<ActionResult<UserDto>> Register([FromQuery] string email, [FromQuery] string displayName, [FromQuery] string password)
    {
        if(await emailExists(email)) return BadRequest("Email is already in use");

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            DisplayName = displayName,
            Email = email,
            PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user.ToDto(tokenService);
    }

    [HttpPost("login")] // api/account/login
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);
        if (user == null) return Unauthorized("Invalid email");

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.Password));
        if (!computedHash.SequenceEqual(user.PasswordHash)) return Unauthorized("Invalid password");

        return user.ToDto(tokenService);
    }

    private async Task<bool> emailExists(string email)
    {
        return await context.Users.AnyAsync(x => x.Email == email);
    } 
}
