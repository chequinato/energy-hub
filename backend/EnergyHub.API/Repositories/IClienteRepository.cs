using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Repositories;

public interface IClienteRepository
{
    Task<List<Cliente>> GetAllAsync();
    Task<Cliente?> GetByIdAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<Cliente> CreateAsync(CreateClienteDto dto);
    Task<Cliente?> UpdateAsync(int id, UpdateClienteDto dto);
    Task<bool> DeleteAsync(int id);
}
