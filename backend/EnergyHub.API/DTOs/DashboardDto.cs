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

    // TOP 5
    public List<ClienteEconomiaDto> TopClientesEconomia { get; set; } = new();
}

public class ClienteEconomiaDto
{
    public int ClienteId { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public decimal EconomiaEstimada { get; set; }
    public string Fornecedor { get; set; } = string.Empty;
}
