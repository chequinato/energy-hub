using System.ComponentModel.DataAnnotations;

namespace EnergyHub.API.DTOs;

public class UpdateClienteDto
{
    [MaxLength(200)]
    public string? Nome { get; set; }

    [MaxLength(20)]
    public string? Cnpj { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? ConsumoMedio { get; set; }

    [MaxLength(50)]
    public string? Regiao { get; set; }
}

