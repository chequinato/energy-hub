using EnergyHub.API.Repositories;
using EnergyHub.API.DTOs;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Services;

public class ConsumoService : IConsumoService
{
    private readonly IConsumoRepository _repository;

    public ConsumoService(IConsumoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ConsumoDto>> GetAllAsync()
    {
        var consumos = await _repository.GetAllAsync();
        return consumos.Select(c => new ConsumoDto
        {
            Id = c.Id,
            ClienteId = c.ClienteId,
            Mes = c.Mes,
            ConsumoMwh = c.ConsumoMwh
        }).ToList();
    }

    public async Task<List<ConsumoDto>> GetAllAsync(int userId)
    {
        var consumos = await _repository.GetAllAsync(userId);
        return consumos.Select(c => new ConsumoDto
        {
            Id = c.Id,
            ClienteId = c.ClienteId,
            Mes = c.Mes,
            ConsumoMwh = c.ConsumoMwh
        }).ToList();
    }

    public async Task<ConsumoDto?> GetByIdAsync(int id)
    {
        var consumo = await _repository.GetByIdAsync(id);
        if (consumo == null) return null;

        return new ConsumoDto
        {
            Id = consumo.Id,
            ClienteId = consumo.ClienteId,
            Mes = consumo.Mes,
            ConsumoMwh = consumo.ConsumoMwh
        };
    }

    public async Task<ConsumoDto?> GetByIdAsync(int id, int userId)
    {
        var consumo = await _repository.GetByIdAsync(id, userId);
        if (consumo == null) return null;

        return new ConsumoDto
        {
            Id = consumo.Id,
            ClienteId = consumo.ClienteId,
            Mes = consumo.Mes,
            ConsumoMwh = consumo.ConsumoMwh
        };
    }

    public async Task<List<ConsumoDto>> GetByClienteIdAsync(int clienteId)
    {
        var consumos = await _repository.GetByClienteIdAsync(clienteId);
        return consumos.Select(c => new ConsumoDto
        {
            Id = c.Id,
            ClienteId = c.ClienteId,
            Mes = c.Mes,
            ConsumoMwh = c.ConsumoMwh
        }).ToList();
    }

    public async Task<decimal> GetConsumoMedioClienteAsync(int clienteId)
    {
        var consumos = await _repository.GetByClienteIdAsync(clienteId);
        
        if (consumos.Count == 0)
            return 0;

        return Math.Round(consumos.Average(c => c.ConsumoMwh), 2);
    }

    public async Task<DashboardConsumoDto> GetAnaliseConsumoClienteAsync(int clienteId, decimal consumoEstimado)
    {
        var consumos = await _repository.GetByClienteIdAsync(clienteId);
        
        var resultado = new DashboardConsumoDto
        {
            ConsumoEstimado = consumoEstimado,
            QuantidadeMeses = consumos.Count
        };

        if (consumos.Count == 0)
        {
            resultado.ConsumoMedioReal = 0;
            resultado.VariacaoPercentual = 0;
            resultado.TendenciaPercentual = 0;
            resultado.TotalConsumido = 0;
            resultado.ConsumoMaximo = 0;
            resultado.ConsumoMinimo = 0;
            return resultado;
        }

        var consumosMwh = consumos.Select(c => c.ConsumoMwh).ToList();
        resultado.ConsumoMedioReal = Math.Round(consumosMwh.Average(), 2);
        resultado.TotalConsumido = Math.Round(consumosMwh.Sum(), 2);
        resultado.ConsumoMaximo = consumosMwh.Max();
        resultado.ConsumoMinimo = consumosMwh.Min();

        if (consumoEstimado > 0)
        {
            var variacao = ((resultado.ConsumoMedioReal - consumoEstimado) / consumoEstimado) * 100;
            resultado.VariacaoPercentual = Math.Round(variacao, 2);
        }

        if (consumos.Count >= 3)
        {
            var ultimos3 = consumosMwh.TakeLast(3).Average();
            var anteriores = consumosMwh.SkipLast(3).Average();
            
            if (anteriores > 0)
            {
                var tendencia = ((ultimos3 - anteriores) / anteriores) * 100;
                resultado.TendenciaPercentual = Math.Round(tendencia, 2);
            }
        }
        else if (consumos.Count >= 2)
        {
            var primeiro = consumosMwh.First();
            var ultimo = consumosMwh.Last();
            
            if (primeiro > 0)
            {
                var tendencia = ((ultimo - primeiro) / primeiro) * 100;
                resultado.TendenciaPercentual = Math.Round(tendencia, 2);
            }
        }

        return resultado;
    }

    public async Task<ConsumoDto> CreateAsync(CreateConsumoDto dto)
    {
        var existe = await _repository.GetByClienteAndMesAsync(dto.ClienteId, dto.Mes);
        if (existe != null)
            throw new InvalidOperationException($"Já existe consumo registrado para este cliente no mês {dto.Mes}");

        var consumo = await _repository.CreateAsync(dto);
        
        return new ConsumoDto
        {
            Id = consumo.Id,
            ClienteId = consumo.ClienteId,
            Mes = consumo.Mes,
            ConsumoMwh = consumo.ConsumoMwh
        };
    }

    public async Task<ConsumoDto?> UpdateAsync(int id, UpdateConsumoDto dto)
    {
        var consumo = await _repository.UpdateAsync(id, dto);
        if (consumo == null) return null;

        return new ConsumoDto
        {
            Id = consumo.Id,
            ClienteId = consumo.ClienteId,
            Mes = consumo.Mes,
            ConsumoMwh = consumo.ConsumoMwh
        };
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

