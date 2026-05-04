using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EnergyHub.API.DTOs;
using EnergyHub.API.Services;
using System.Security.Claims;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly UsuarioService _usuarioService;

    public UsuariosController(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet("perfil")]
    public ActionResult<UsuarioDto> GetPerfil()
    {
        // Temporário - dados mockados
        // Depois vamos buscar do banco usando o userId do token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var usuarioDto = new UsuarioDto
        {
            Id = int.Parse(userId ?? "1"),
            Nome = "Usuário Teste", // Temporário
            Email = "usuario@teste.com", // Temporário
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return Ok(usuarioDto);
    }
}
