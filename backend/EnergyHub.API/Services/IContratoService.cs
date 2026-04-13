using EnergyHub.API.DTOs;

namespace EnergyHub.API.Services;

public interface IContratoService
{
    Task<List<ContratoDto>> GetAllAsync();
    Task<List<ContratoDto>> GetByClienteIdAsync(int clienteId);
    Task<ContratoDto?> GetByIdAsync(int id);
    Task<ContratoDto> CreateAsync(CreateContratoDto dto);
    Task<ContratoDto?> UpdateAsync(int id, CreateContratoDto dto);
    Task<bool> DeleteAsync(int id);
}

