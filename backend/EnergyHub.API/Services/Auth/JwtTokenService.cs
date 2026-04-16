using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EnergyHub.API.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EnergyHub.API.Services.Auth;

public class JwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAt) CreateToken(Usuario user)
    {
        var key = _configuration["Jwt:Key"] ?? string.Empty;
        if (string.IsNullOrWhiteSpace(key))
            throw new InvalidOperationException("Jwt:Key não configurado.");

        var issuer = _configuration["Jwt:Issuer"] ?? string.Empty;
        var audience = _configuration["Jwt:Audience"] ?? string.Empty;

        var expiresMinutes = int.TryParse(_configuration["Jwt:ExpiresMinutes"], out var minutes)
            ? minutes
            : 120;

        var expiresAt = DateTime.UtcNow.AddMinutes(expiresMinutes);

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("nome", user.Nome)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return (tokenHandler.WriteToken(token), expiresAt);
    }
}

