namespace EnergyHub.API.DTOs;

public class DashboardDto
{
    // Contratos
    public int TotalContratos { get; set; }
    public int TotalContratosAtivos { get; set; }
    public int TotalContratosExpirados { get; set; }
    public int TotalContratosFuturos { get; set; }

    // Clientes
    public int TotalClientes { get; set; }
    public int ClientesComContratoAtivo { get; set; }

    // Economia
    public decimal EconomiaTotal { get; set; }
    public decimal EconomiaMensal { get; set; }

    // Consumo (Novo!)
    public decimal ConsumoTotalRegistrado { get; set; }
    public decimal ConsumoMedioGeral { get; set; }
    public decimal VariacaoMediaConsumoCli { get; set; }
    public decimal TendenciaMediaConsumoCli { get; set; }

    // TOP 5
    public List<ClienteEconomiaDto> TopClientesEconomia { get; set; } = new();
}

public class ClienteEconomiaDto
{
    public int ClienteId { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public decimal ConsumoMedioMensal { get; set; }
    public decimal EconomiaEstimada { get; set; }
    public string Fornecedor { get; set; } = string.Empty;

    // Novo: Análise de Consumo
    public decimal ConsumoEstimado { get; set; }
    public decimal VariacaoPercentual { get; set; }
    public decimal TendenciaPercentual { get; set; }
}
