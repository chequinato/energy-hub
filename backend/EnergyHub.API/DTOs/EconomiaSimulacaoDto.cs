using System.ComponentModel.DataAnnotations;

namespace EnergyHub.API.DTOs;

public class EconomiaSimulacaoDto
{
    public int ClienteId { get; set; }
    public decimal ConsumoMwh { get; set; }
    public decimal PrecoAtualMwh { get; set; } // Preço atual do cliente
    public decimal? EconomiaPercentual { get; set; }
    public decimal? EconomiaValor { get; set; }
}

