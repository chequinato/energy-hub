using EnergyHub.API.DTOs;

namespace EnergyHub.API.Services;

public interface IClienteService
{
    Task<List<ClienteDto>> GetAllAsync();
    Task<ClienteDto?> GetByIdAsync(int id);
    Task<ClienteDto> CreateAsync(CreateClienteDto dto);
    Task<ClienteDto?> UpdateAsync(int id, UpdateClienteDto dto);
    Task<bool> DeleteAsync(int id);
    Task<EconomiaSimulacaoDto> CalcularEconomiaAsync(int clienteId, decimal precoAtualMwh);
}

