using EnergyHub.API.DTOs;

namespace EnergyHub.API.Services;

public interface IConsumoService
{
    Task<List<ConsumoDto>> GetAllAsync();
    Task<List<ConsumoDto>> GetAllAsync(int userId);
    Task<ConsumoDto?> GetByIdAsync(int id);
    Task<ConsumoDto?> GetByIdAsync(int id, int userId);
    Task<List<ConsumoDto>> GetByClienteIdAsync(int clienteId);
    Task<decimal> GetConsumoMedioClienteAsync(int clienteId);
    Task<DashboardConsumoDto> GetAnaliseConsumoClienteAsync(int clienteId, decimal consumoEstimado);
    Task<ConsumoDto> CreateAsync(CreateConsumoDto dto);
    Task<ConsumoDto?> UpdateAsync(int id, UpdateConsumoDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> DeleteAsync(int id, int userId);
}