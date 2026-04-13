using System.ComponentModel.DataAnnotations;

namespace EnergyHub.API.DTOs;

public class CreateContratoDto
{
    public int ClienteId { get; set; }

    [Range(0, double.MaxValue)]
    public decimal PrecoMwh { get; set; }

    [MaxLength(100)]
    public string Fornecedor { get; set; } = string.Empty;

    public DateOnly DataInicio { get; set; }

    public DateOnly DataFim { get; set; }
}

