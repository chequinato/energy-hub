using EnergyHub.API.Repositories;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Services;

public class ContratoService : IContratoService
{
    private readonly IContratoRepository _repository;
    private readonly IClienteRepository _clienteRepository;

    public ContratoService(IContratoRepository repository, IClienteRepository clienteRepository)
    {
        _repository = repository;
        _clienteRepository = clienteRepository;
    }

    private ContratoDto MapToDto(Contrato c)
    {
        var status = ContratoStatusHelper.GetStatus(c.DataInicio, c.DataFim);
        return new ContratoDto
        {
            Id = c.Id,
            ClienteId = c.ClienteId,
            PrecoMwh = c.PrecoMwh,
            Fornecedor = c.Fornecedor,
            DataInicio = c.DataInicio,
            DataFim = c.DataFim,
            Status = status,
            StatusBadge = ContratoStatusHelper.GetStatusBadge(status)
        };
    }

    public async Task<List<ContratoDto>> GetAllAsync()
    {
        var contratos = await _repository.GetAllAsync();
        return contratos.Select(MapToDto).ToList();
    }

    public async Task<List<ContratoDto>> GetAllAsync(int userId)
    {
        var contratos = await _repository.GetAllAsync(userId);
        return contratos.Select(MapToDto).ToList();
    }

    public async Task<List<ContratoDto>> GetByClienteIdAsync(int clienteId)
    {
        var contratos = await _repository.GetByClienteIdAsync(clienteId);
        return contratos.Select(MapToDto).ToList();
    }

    public async Task<ContratoDto?> GetByIdAsync(int id)
    {
        var contrato = await _repository.GetByIdAsync(id);
        return contrato == null ? null : MapToDto(contrato);
    }

    public async Task<ContratoDto?> GetByIdAsync(int id, int userId)
    {
        var contrato = await _repository.GetByIdAsync(id, userId);
        return contrato == null ? null : MapToDto(contrato);
    }

    public async Task<ContratoDto> CreateAsync(CreateContratoDto dto)
    {
        // Validação: Cliente deve existir
        var clienteExiste = await _clienteRepository.ExistsAsync(dto.ClienteId, dto.UsuarioId);
        if (!clienteExiste)
        {
            throw new ArgumentException($"Cliente com ID {dto.ClienteId} não encontrado");
        }

        var contrato = await _repository.CreateAsync(dto);
        return MapToDto(contrato);
    }

    public async Task<ContratoDto?> UpdateAsync(int id, CreateContratoDto dto)
    {
        var contrato = await _repository.UpdateAsync(id, dto);
        return contrato == null ? null : MapToDto(contrato);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        return await _repository.DeleteAsync(id, userId);
    }
}

