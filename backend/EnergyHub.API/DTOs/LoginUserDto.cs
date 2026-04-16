using System.ComponentModel.DataAnnotations;

namespace EnergyHub.API.DTOs;

public class LoginUserDto
{
    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string Senha { get; set; } = string.Empty;
}

