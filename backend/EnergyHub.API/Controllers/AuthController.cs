using EnergyHub.API.Data;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;
using EnergyHub.API.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(ApplicationDbContext db, PasswordHasher passwordHasher, JwtTokenService jwtTokenService)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterUserDto dto)
    {
        Console.WriteLine("=== REGISTER ===");

        if (!ModelState.IsValid)
        {
            Console.WriteLine("Model inválido");
            return BadRequest(new { message = "Dados inválidos para registro.", errors = ModelState });
        }

        Console.WriteLine($"Nome: {dto.Nome}");
        Console.WriteLine($"Email: {dto.Email}");
        Console.WriteLine($"Senha: [{dto.Senha}]");

        var email = dto.Email.Trim().ToLowerInvariant();
        var nome = dto.Nome.Trim();

        var exists = await _db.Usuarios.AnyAsync(u => u.Email == email);
        if (exists)
        {
            Console.WriteLine("Email já existe");
            return Conflict(new { message = "Este email já está em uso." });
        }

        var (hashBase64, saltBase64) = _passwordHasher.HashPassword(dto.Senha);

        Console.WriteLine($"HASH: {hashBase64}");
        Console.WriteLine($"SALT: {saltBase64}");

        var user = new Usuario
        {
            Nome = nome,
            Email = email,
            PasswordHash = hashBase64,
            PasswordSalt = saltBase64
        };

        _db.Usuarios.Add(user);
        await _db.SaveChangesAsync();

        Console.WriteLine("Usuário criado com sucesso");

        var (token, expiresAt) = _jwtTokenService.CreateToken(user);

        return Created(string.Empty, new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Nome = user.Nome,
            Email = user.Email,
            ExpiresAt = expiresAt
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginUserDto dto)
    {
        Console.WriteLine("=== LOGIN ===");

        if (!ModelState.IsValid)
        {
            Console.WriteLine("Model inválido");
            return BadRequest(new { message = "Dados inválidos para login.", errors = ModelState });
        }

        Console.WriteLine($"Email digitado: {dto.Email}");
        Console.WriteLine($"Senha digitada: [{dto.Senha}]");

        var email = dto.Email.Trim().ToLowerInvariant();

        var user = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
        {
            Console.WriteLine("Usuário NÃO encontrado");
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        Console.WriteLine("Usuário encontrado");
        Console.WriteLine($"HASH do banco: {user.PasswordHash}");
        Console.WriteLine($"SALT do banco: {user.PasswordSalt}");

        var valid = _passwordHasher.VerifyPassword(dto.Senha, user.PasswordSalt, user.PasswordHash);

        Console.WriteLine($"Senha válida? {valid}");

        if (!valid)
        {
            Console.WriteLine("Senha incorreta");
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        Console.WriteLine("Login OK");

        var (token, expiresAt) = _jwtTokenService.CreateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UserId = user.Id,
            Nome = user.Nome,
            Email = user.Email,
            ExpiresAt = expiresAt
        });
    }
}