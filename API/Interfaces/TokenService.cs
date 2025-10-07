using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using API.Entities;
using Microsoft.IdentityModel.Tokens;

namespace API.Interfaces;

public class TokenService(IConfiguration config) : ITokenService
{

    public string CreateToken(AppUser user)
    {
        var GetTokenKey = config["TokenKey"] ?? throw new Exception("TokenKey not found in configuration");
        if (GetTokenKey.Length < 64) throw new Exception("TokenKey must be at least 64 characters long");

        //Signature created
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(GetTokenKey));

        //Payload created
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        //Create Signature (Key + Signing Algorithm)
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        //Create Token Descriptor (Header, Payload, Signature, Expiry)
        var tokenDescription = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims), // Payload
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds // Signature & Header Info
        };

        //Generate and Return Token
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescription);
    
        return tokenHandler.WriteToken(token);

    }

}
