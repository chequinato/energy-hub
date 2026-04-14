using EnergyHub.API.Repositories;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync();
}

public class DashboardService : IDashboardService
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IContratoRepository _contratoRepository;

    public DashboardService(IClienteRepository clienteRepository, IContratoRepository contratoRepository)
    {
        _clienteRepository = clienteRepository;
        _contratoRepository = contratoRepository;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        var clientes = await _clienteRepository.GetAllAsync();
        var contratos = await _contratoRepository.GetAllAsync();

        // Contar contratos por status
        var contratosAtivos = contratos.Count(c => ContratoStatusHelper.GetStatus(c.DataInicio, c.DataFim) == ContratoStatus.Ativo);
        var contratosExpirados = contratos.Count(c => ContratoStatusHelper.GetStatus(c.DataInicio, c.DataFim) == ContratoStatus.Expirado);
        var contratosFuturos = contratos.Count(c => ContratoStatusHelper.GetStatus(c.DataInicio, c.DataFim) == ContratoStatus.Futuro);

        // Clientes com contrato ativo
        var clientesComContratoAtivo = clientes.Count(c =>
            c.Contratos != null &&
            c.Contratos.Any(ct => ContratoStatusHelper.GetStatus(ct.DataInicio, ct.DataFim) == ContratoStatus.Ativo)
        );

        // Calcular economia total (usando preço de referência 500 R$/MWh)
        decimal precoReferencia = 500m;
        decimal economiaTotal = 0;

        var allClientesEconomia = clientes
            .Where(c => c.Contratos != null && c.Contratos.Count > 0)
            .Select(c =>
            {
                var contratoAtivo = c.Contratos!
                    .FirstOrDefault(ct => ContratoStatusHelper.GetStatus(ct.DataInicio, ct.DataFim) == ContratoStatus.Ativo);

                if (contratoAtivo == null)
                    return null;

                decimal diferenca = precoReferencia - contratoAtivo.PrecoMwh;
                decimal economia = diferenca * c.ConsumoMedio;

                return new ClienteEconomiaDto
                {
                    ClienteId = c.Id,
                    NomeCliente = c.Nome,
                    EconomiaEstimada = Math.Round(economia, 2),
                    Fornecedor = contratoAtivo.Fornecedor
                };
            })
            .Where(x => x != null)
            .Select(x => x!)
            .ToList();

        var topClientesEconomia = allClientesEconomia
            .OrderByDescending(x => x.EconomiaEstimada)
            .Take(5)
            .ToList();

        economiaTotal = allClientesEconomia.Sum(x => x.EconomiaEstimada);

        return new DashboardDto
        {
            TotalContratos = contratos.Count,
            TotalContratosAtivos = contratosAtivos,
            TotalContratosExpirados = contratosExpirados,
            TotalContratosFuturos = contratosFuturos,
            TotalClientes = clientes.Count,
            ClientesComContratoAtivo = clientesComContratoAtivo,
            EconomiaTotal = Math.Round(economiaTotal, 2),
            EconomiaMensal = Math.Round(economiaTotal / 12, 2),
            TopClientesEconomia = topClientesEconomia
        };
    }
}
