using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Repositories;

public interface IClienteRepository
{
    Task<List<Cliente>> GetAllAsync();
    Task<List<Cliente>> GetAllAsync(int userId);
    Task<Cliente?> GetByIdAsync(int id);
    Task<Cliente?> GetByIdAsync(int id, int userId);
    Task<bool> ExistsAsync(int id);
    Task<bool> ExistsAsync(int id, int userId);
    Task<Cliente> CreateAsync(CreateClienteDto dto, int userId);
    Task<Cliente?> UpdateAsync(int id, UpdateClienteDto dto, int userId);
    Task<bool> DeleteAsync(int id);
    Task<bool> DeleteAsync(int id, int userId);
}
