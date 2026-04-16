namespace EnergyHub.API.DTOs;

public class EconomiaSimulacaoDto
{
    public int ClienteId { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public decimal ConsumoMedioMensal { get; set; }
    public decimal PrecoAtualMwh { get; set; }
    public decimal PrecoContratoMwh { get; set; }
    public decimal EconomiaMensal { get; set; }
    public decimal EconomiaAnual { get; set; }
    public bool PossuiContratoAtivo { get; set; }
}
