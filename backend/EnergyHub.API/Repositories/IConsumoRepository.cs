using EnergyHub.API.Entities;
using EnergyHub.API.DTOs;

namespace EnergyHub.API.Repositories;

public interface IConsumoRepository
{
    Task<List<Consumo>> GetAllAsync();
    Task<Consumo?> GetByIdAsync(int id);
    Task<List<Consumo>> GetByClienteIdAsync(int clienteId);
    Task<Consumo?> GetByClienteAndMesAsync(int clienteId, string mes);
    Task<bool> ExistsAsync(int id);
    Task<Consumo> CreateAsync(CreateConsumoDto dto);
    Task<Consumo?> UpdateAsync(int id, UpdateConsumoDto dto);
    Task<bool> DeleteAsync(int id);
}
