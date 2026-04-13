using EnergyHub.API.Entities;
using EnergyHub.API.DTOs;

namespace EnergyHub.API.Repositories;

public interface IContratoRepository
{
    Task<List<Contrato>> GetAllAsync();
    Task<List<Contrato>> GetByClienteIdAsync(int clienteId);
    Task<Contrato?> GetByIdAsync(int id);
    Task<Contrato> CreateAsync(CreateContratoDto dto);
    Task<Contrato?> UpdateAsync(int id, CreateContratoDto dto);
    Task<bool> DeleteAsync(int id);
}

