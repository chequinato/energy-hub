using System.ComponentModel.DataAnnotations;

namespace EnergyHub.API.DTOs;

public class CreateClienteDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Cnpj { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal ConsumoMedio { get; set; } = 0;

    [MaxLength(50)]
    public string Regiao { get; set; } = string.Empty;
}

