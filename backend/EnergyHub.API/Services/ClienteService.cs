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

        // Busca contrato ativo mais recente (simplificado)
        var contrato = cliente.Contratos?.OrderByDescending(c => c.DataInicio).FirstOrDefault(c => c.DataFim >= DateOnly.FromDateTime(DateTime.Now));
        decimal precoContrato = contrato?.PrecoMwh ?? 500m; // Default mercado livre

        decimal consumo = cliente.ConsumoMedio;
        decimal economiaValor = (precoAtualMwh - precoContrato) * consumo;
        decimal economiaPercentual = (economiaValor / (precoAtualMwh * consumo)) * 100;

        return new EconomiaSimulacaoDto
        {
            ClienteId = clienteId,
            ConsumoMwh = consumo,
            PrecoAtualMwh = precoAtualMwh,
            EconomiaPercentual = Math.Round(economiaPercentual, 2),
            EconomiaValor = Math.Round(economiaValor, 2)
        };
    }
}

