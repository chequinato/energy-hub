namespace EnergyHub.API.DTOs;

public class ClienteDetailDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public decimal ConsumoMedio { get; set; }
    public string Regiao { get; set; } = string.Empty;

    // Novo: Contrato ativo (se houver)
    public ContratoDto? ContratoAtivo { get; set; }

    // Novo: Status do cliente em relação a contrato
    public string StatusContrato { get; set; } = "Sem contrato";

    // Novo: Economia estimada (considerando contrato ativo)
    public decimal EconomiaEstimada { get; set; }
}
