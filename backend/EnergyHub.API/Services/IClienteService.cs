using EnergyHub.API.DTOs;

namespace EnergyHub.API.Services;

public interface IClienteService
{
    Task<List<ClienteDto>> GetAllAsync();
    Task<List<ClienteDto>> GetAllAsync(int userId);
    Task<List<ClienteDetailDto>> GetAllWithDetailsAsync();
    Task<List<ClienteDetailDto>> GetAllWithDetailsAsync(int userId);
    Task<ClienteDto?> GetByIdAsync(int id);
    Task<ClienteDto?> GetByIdAsync(int id, int userId);
    Task<ClienteDetailDto?> GetByIdWithDetailsAsync(int id);
    Task<ClienteDetailDto?> GetByIdWithDetailsAsync(int id, int userId);
    Task<ClienteDto> CreateAsync(CreateClienteDto dto);
    Task<ClienteDto> CreateAsync(CreateClienteDto dto, int userId);
    Task<ClienteDto?> UpdateAsync(int id, UpdateClienteDto dto);
    Task<ClienteDto?> UpdateAsync(int id, UpdateClienteDto dto, int userId);
    Task<bool> DeleteAsync(int id);
    Task<bool> DeleteAsync(int id, int userId);
    Task<EconomiaSimulacaoDto> CalcularEconomiaAsync(int clienteId, int userId, decimal precoAtualMwh);
}
