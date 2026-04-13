using EnergyHub.API.Repositories;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Services;

public class ContratoService : IContratoService
{
    private readonly IContratoRepository _repository;

    public ContratoService(IContratoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ContratoDto>> GetAllAsync()
    {
        var contratos = await _repository.GetAllAsync();
        return contratos.Select(c => new ContratoDto
        {
            Id = c.Id,
            ClienteId = c.ClienteId,
            PrecoMwh = c.PrecoMwh,
            Fornecedor = c.Fornecedor,
            DataInicio = c.DataInicio,
            DataFim = c.DataFim
        }).ToList();
    }

    public async Task<List<ContratoDto>> GetByClienteIdAsync(int clienteId)
    {
        var contratos = await _repository.GetByClienteIdAsync(clienteId);
        return contratos.Select(c => new ContratoDto
        {
            Id = c.Id,
            ClienteId = c.ClienteId,
            PrecoMwh = c.PrecoMwh,
            Fornecedor = c.Fornecedor,
            DataInicio = c.DataInicio,
            DataFim = c.DataFim
        }).ToList();
    }

    public async Task<ContratoDto?> GetByIdAsync(int id)
    {
        var contrato = await _repository.GetByIdAsync(id);
        return contrato == null ? null : new ContratoDto
        {
            Id = contrato.Id,
            ClienteId = contrato.ClienteId,
            PrecoMwh = contrato.PrecoMwh,
            Fornecedor = contrato.Fornecedor,
            DataInicio = contrato.DataInicio,
            DataFim = contrato.DataFim
        };
    }

    public async Task<ContratoDto> CreateAsync(CreateContratoDto dto)
    {
        var contrato = await _repository.CreateAsync(dto);
        return new ContratoDto
        {
            Id = contrato.Id,
            ClienteId = dto.ClienteId,
            PrecoMwh = dto.PrecoMwh,
            Fornecedor = dto.Fornecedor,
            DataInicio = dto.DataInicio,
            DataFim = dto.DataFim
        };
    }

    public async Task<ContratoDto?> UpdateAsync(int id, CreateContratoDto dto)
    {
        var contrato = await _repository.UpdateAsync(id, dto);
        return contrato == null ? null : new ContratoDto
        {
            Id = contrato.Id,
            ClienteId = dto.ClienteId,
            PrecoMwh = dto.PrecoMwh,
            Fornecedor = dto.Fornecedor,
            DataInicio = dto.DataInicio,
            DataFim = dto.DataFim
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
}

