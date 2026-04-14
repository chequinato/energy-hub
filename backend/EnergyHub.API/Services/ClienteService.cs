using EnergyHub.API.Repositories;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;
using EnergyHub.API.Data;

namespace EnergyHub.API.Services;

public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repository;

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }

    private ContratoDto? GetContratoAtivo(Cliente cliente)
    {
        if (cliente.Contratos == null || cliente.Contratos.Count == 0)
            return null;

        var contratoAtivo = cliente.Contratos
            .FirstOrDefault(c => ContratoStatusHelper.GetStatus(c.DataInicio, c.DataFim) == ContratoStatus.Ativo);

        if (contratoAtivo == null)
            return null;

        var status = ContratoStatus.Ativo;
        return new ContratoDto
        {
            Id = contratoAtivo.Id,
            ClienteId = contratoAtivo.ClienteId,
            PrecoMwh = contratoAtivo.PrecoMwh,
            Fornecedor = contratoAtivo.Fornecedor,
            DataInicio = contratoAtivo.DataInicio,
            DataFim = contratoAtivo.DataFim,
            Status = status,
            StatusBadge = ContratoStatusHelper.GetStatusBadge(status)
        };
    }

    private decimal CalcularEconomiaComContrato(Cliente cliente)
    {
        var contratoAtivo = GetContratoAtivo(cliente);
        if (contratoAtivo == null)
            return 0;

        // Assumindo preço de referência do mercado: 500 R$/MWh
        decimal precoReferencia = 500m;
        decimal diferenca = precoReferencia - contratoAtivo.PrecoMwh;
        return diferenca * cliente.ConsumoMedio;
    }

    private ClienteDetailDto MapToDetailDto(Cliente c)
    {
        var contratoAtivo = GetContratoAtivo(c);
        return new ClienteDetailDto
        {
            Id = c.Id,
            Nome = c.Nome,
            Cnpj = c.Cnpj,
            ConsumoMedio = c.ConsumoMedio,
            Regiao = c.Regiao,
            ContratoAtivo = contratoAtivo,
            StatusContrato = contratoAtivo != null ? "✅ Contrato Ativo" : "❌ Sem Contrato",
            EconomiaEstimada = CalcularEconomiaComContrato(c)
        };
    }

    public async Task<List<ClienteDto>> GetAllAsync()
    {
        var clientes = await _repository.GetAllAsync();
        return clientes.Select(c => new ClienteDto
        {
            Id = c.Id,
            Nome = c.Nome,
            Cnpj = c.Cnpj,
            ConsumoMedio = c.ConsumoMedio,
            Regiao = c.Regiao
        }).ToList();
    }

    public async Task<List<ClienteDetailDto>> GetAllWithDetailsAsync()
    {
        var clientes = await _repository.GetAllAsync();
        return clientes.Select(MapToDetailDto).ToList();
    }

    public async Task<ClienteDto?> GetByIdAsync(int id)
    {
        var cliente = await _repository.GetByIdAsync(id);
        return cliente == null ? null : new ClienteDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            Cnpj = cliente.Cnpj,
            ConsumoMedio = cliente.ConsumoMedio,
            Regiao = cliente.Regiao
        };
    }

    public async Task<ClienteDetailDto?> GetByIdWithDetailsAsync(int id)
    {
        var cliente = await _repository.GetByIdAsync(id);
        return cliente == null ? null : MapToDetailDto(cliente);
    }

    public async Task<ClienteDto> CreateAsync(CreateClienteDto dto)
    {
        var cliente = await _repository.CreateAsync(dto);
        return new ClienteDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            Cnpj = cliente.Cnpj,
            ConsumoMedio = cliente.ConsumoMedio,
            Regiao = cliente.Regiao
        };
    }

    public async Task<ClienteDto?> UpdateAsync(int id, UpdateClienteDto dto)
    {
        var cliente = await _repository.UpdateAsync(id, dto);
        return cliente == null ? null : new ClienteDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            Cnpj = cliente.Cnpj,
            ConsumoMedio = cliente.ConsumoMedio,
            Regiao = cliente.Regiao
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<EconomiaSimulacaoDto> CalcularEconomiaAsync(int clienteId, decimal precoAtualMwh)
    {
        var cliente = await _repository.GetByIdAsync(clienteId);
        if (cliente == null)
        {
            throw new ArgumentException("Cliente não encontrado");
        }

        // Busca contrato ativo
        var contratoAtivo = GetContratoAtivo(cliente);
        decimal precoContrato = contratoAtivo?.PrecoMwh ?? 500m; // Default mercado livre

        decimal consumo = cliente.ConsumoMedio;
        decimal economiaValor = (precoAtualMwh - precoContrato) * consumo;
        decimal economiaPercentual = precoAtualMwh > 0 ? (economiaValor / (precoAtualMwh * consumo)) * 100 : 0;

        return new EconomiaSimulacaoDto
        {
            ClienteId = clienteId,
            ConsumoMwh = consumo,
            PrecoAtualMwh = precoAtualMwh,
            EconomiaPercentual = Math.Round(economiaPercentual, 2),
            EconomiaValor = Math.Round(economiaValor, 2)
        };
    }

    /// <summary>
    /// Simula economia usando preço do contrato ativo do cliente
    /// </summary>
    public async Task<EconomiaSimulacaoDto> SimularEconomiaComContratoAsync(int clienteId, decimal precoMercadoAtualMwh)
    {
        var cliente = await _repository.GetByIdAsync(clienteId);
        if (cliente == null)
        {
            throw new ArgumentException("Cliente não encontrado");
        }

        var contratoAtivo = GetContratoAtivo(cliente);
        if (contratoAtivo == null)
        {
            throw new ArgumentException("Cliente não possui contrato ativo");
        }

        decimal consumo = cliente.ConsumoMedio;
        decimal economiaValor = (precoMercadoAtualMwh - contratoAtivo.PrecoMwh) * consumo;
        decimal economiaPercentual = precoMercadoAtualMwh > 0 
            ? (economiaValor / (precoMercadoAtualMwh * consumo)) * 100 
            : 0;

        return new EconomiaSimulacaoDto
        {
            ClienteId = clienteId,
            ConsumoMwh = consumo,
            PrecoAtualMwh = precoMercadoAtualMwh,
            EconomiaPercentual = Math.Round(economiaPercentual, 2),
            EconomiaValor = Math.Round(economiaValor, 2)
        };
    }
}

