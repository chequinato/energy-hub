using EnergyHub.API.Entities;

namespace EnergyHub.API.DTOs;

public class ContratoDto
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public decimal PrecoMwh { get; set; }
    public string Fornecedor { get; set; } = string.Empty;
    public DateOnly DataInicio { get; set; }
    public DateOnly DataFim { get; set; }
    
    // Novo: Status calculado
    public ContratoStatus Status { get; set; }
    
    // Novo: Badge visual
    public string StatusBadge { get; set; } = string.Empty;
}

