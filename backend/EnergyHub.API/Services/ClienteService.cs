using EnergyHub.API.Repositories;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;
using System.Linq;

namespace EnergyHub.API.Services;

public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repository;

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ClienteDto>> GetAllAsync(int userId)
    {
        var clientes = await _repository.GetAllAsync(userId);

        return clientes.Select(MapToDto).ToList();
    }

    public async Task<List<ClienteDetailDto>> GetAllWithDetailsAsync(int userId)
    {
        var clientes = await _repository.GetAllAsync(userId);

        return clientes.Select(MapToDetailDto).ToList();
    }

    public async Task<ClienteDto?> GetByIdAsync(int id, int userId)
    {
        var cliente = await _repository.GetByIdAsync(id, userId);

        return cliente == null ? null : MapToDto(cliente);
    }

    public async Task<ClienteDetailDto?> GetByIdWithDetailsAsync(int id, int userId)
    {
        var cliente = await _repository.GetByIdAsync(id, userId);

        return cliente == null ? null : MapToDetailDto(cliente);
    }

    public async Task<ClienteDto> CreateAsync(CreateClienteDto dto, int userId)
    {
        var cliente = await _repository.CreateAsync(dto, userId);

        return MapToDto(cliente);
    }

    public async Task<ClienteDto?> UpdateAsync(int id, UpdateClienteDto dto, int userId)
    {
        var cliente = await _repository.UpdateAsync(id, dto, userId);

        return cliente == null ? null : MapToDto(cliente);
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        return await _repository.DeleteAsync(id, userId);
    }

    // 🔥 DTO SIMPLES
    private ClienteDto MapToDto(Cliente c)
    {
        return new ClienteDto
        {
            Id = c.Id,
            Nome = c.Nome,
            Cnpj = c.Cnpj,
            ConsumoMedio = c.ConsumoMedio,
            Regiao = c.Regiao
        };
    }

    // 🔥 DTO DETALHADO (AQUI TÁ O FIX REAL)
    private ClienteDetailDto MapToDetailDto(Cliente c)
    {
        var contratoAtivo = c.Contratos?
            .FirstOrDefault(x =>
                x.DataFim >= DateTime.UtcNow &&
                x.DataInicio <= DateTime.UtcNow);

        return new ClienteDetailDto
        {
            Id = c.Id,
            Nome = c.Nome,
            Cnpj = c.Cnpj,
            ConsumoMedio = c.ConsumoMedio,
            Regiao = c.Regiao,

            StatusContrato = contratoAtivo != null ? "Ativo" : "Sem contrato",
            EconomiaEstimada = CalcularEconomia(c, contratoAtivo)
        };
    }

    // 🔥 lógica decente de economia
    private decimal CalcularEconomia(Cliente c, Contrato? contrato)
    {
        if (contrato == null)
            return 0;

        decimal precoReferencia = 500m;

        return (precoReferencia - contrato.PrecoMwh) * c.ConsumoMedio;
    }
}