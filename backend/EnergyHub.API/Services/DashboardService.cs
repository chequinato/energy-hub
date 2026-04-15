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
    private readonly IConsumoService _consumoService;

    public DashboardService(
        IClienteRepository clienteRepository, 
        IContratoRepository contratoRepository,
        IConsumoService consumoService)
    {
        _clienteRepository = clienteRepository;
        _contratoRepository = contratoRepository;
        _consumoService = consumoService;
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

        var allClientesEconomia = new List<ClienteEconomiaDto>();
        var analiseConsumoList = new List<DashboardConsumoDto>();

        foreach (var c in clientes.Where(c => c.Contratos != null && c.Contratos.Count > 0))
        {
            var contratoAtivo = c.Contratos!
                .FirstOrDefault(ct => ContratoStatusHelper.GetStatus(ct.DataInicio, ct.DataFim) == ContratoStatus.Ativo);

            if (contratoAtivo == null)
                continue;

            // Obter análise detalhada de consumo
            var analiseConsumo = await _consumoService.GetAnaliseConsumoClienteAsync(c.Id, c.ConsumoMedio);
            analiseConsumoList.Add(analiseConsumo);

            // Usar consumo médio real se houver histórico, senão usa estimado
            decimal consumoMedio = analiseConsumo.ConsumoMedioReal > 0 ? analiseConsumo.ConsumoMedioReal : analiseConsumo.ConsumoEstimado;

            decimal diferenca = precoReferencia - contratoAtivo.PrecoMwh;
            decimal economia = diferenca * consumoMedio;

            var dto = new ClienteEconomiaDto
            {
                ClienteId = c.Id,
                NomeCliente = c.Nome,
                ConsumoMedioMensal = consumoMedio,
                ConsumoEstimado = analiseConsumo.ConsumoEstimado,
                VariacaoPercentual = analiseConsumo.VariacaoPercentual,
                TendenciaPercentual = analiseConsumo.TendenciaPercentual,
                EconomiaEstimada = Math.Round(economia, 2),
                Fornecedor = contratoAtivo.Fornecedor
            };

            allClientesEconomia.Add(dto);
        }

        var topClientesEconomia = allClientesEconomia
            .OrderByDescending(x => x.EconomiaEstimada)
            .Take(5)
            .ToList();

        economiaTotal = allClientesEconomia.Sum(x => x.EconomiaEstimada);

        // Calcular métricas gerais de consumo
        decimal consumoTotalRegistrado = analiseConsumoList.Sum(x => x.TotalConsumido);
        decimal consumoMedioGeral = analiseConsumoList.Count > 0 ? 
            Math.Round(analiseConsumoList.Average(x => x.ConsumoMedioReal), 2) : 0;
        decimal variacaoMediaGeral = analiseConsumoList.Count > 0 ?
            Math.Round(analiseConsumoList.Average(x => x.VariacaoPercentual), 2) : 0;
        decimal tendenciaMediaGeral = analiseConsumoList.Count > 0 ?
            Math.Round(analiseConsumoList.Average(x => x.TendenciaPercentual), 2) : 0;

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
            ConsumoTotalRegistrado = Math.Round(consumoTotalRegistrado, 2),
            ConsumoMedioGeral = consumoMedioGeral,
            VariacaoMediaConsumoCli = variacaoMediaGeral,
            TendenciaMediaConsumoCli = tendenciaMediaGeral,
            TopClientesEconomia = topClientesEconomia
        };
    }
}
