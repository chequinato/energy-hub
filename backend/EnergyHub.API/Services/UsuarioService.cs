using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Services;

public class UsuarioService
{
    public UsuarioDto MapToDto(Usuario usuario)
    {
        return new UsuarioDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            CreatedAt = DateTime.UtcNow, // Temporário, virá do banco depois
            UpdatedAt = DateTime.UtcNow  // Temporário, virá do banco depois
        };
    }
}
