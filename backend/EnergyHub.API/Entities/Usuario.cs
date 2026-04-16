using System.ComponentModel.DataAnnotations;

namespace EnergyHub.API.Entities;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    // PBKDF2 (SHA256) - hash em Base64
    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    // Salt em Base64
    [Required]
    public string PasswordSalt { get; set; } = string.Empty;
}

