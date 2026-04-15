using Microsoft.EntityFrameworkCore;
using EnergyHub.API.Data;
using EnergyHub.API.Entities;
using EnergyHub.API.DTOs;

namespace EnergyHub.API.Repositories;

public class ConsumoRepository : IConsumoRepository
{
    private readonly ApplicationDbContext _context;

    public ConsumoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Consumo>> GetAllAsync()
    {
        return await _context.Consumos
            .Include(c => c.Cliente)
            .OrderByDescending(c => c.Mes)
            .ToListAsync();
    }

    public async Task<Consumo?> GetByIdAsync(int id)
    {
        return await _context.Consumos
            .Include(c => c.Cliente)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Consumo>> GetByClienteIdAsync(int clienteId)
    {
        return await _context.Consumos
            .Where(c => c.ClienteId == clienteId)
            .OrderByDescending(c => c.Mes)
            .ToListAsync();
    }

    public async Task<Consumo?> GetByClienteAndMesAsync(int clienteId, string mes)
    {
        return await _context.Consumos
            .FirstOrDefaultAsync(c => c.ClienteId == clienteId && c.Mes == mes);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Consumos.AnyAsync(c => c.Id == id);
    }

    public async Task<Consumo> CreateAsync(CreateConsumoDto dto)
    {
        var consumo = new Consumo
        {
            ClienteId = dto.ClienteId,
            Mes = dto.Mes,
            ConsumoMwh = dto.ConsumoMwh
        };

        _context.Consumos.Add(consumo);
        await _context.SaveChangesAsync();

        return consumo;
    }

    public async Task<Consumo?> UpdateAsync(int id, UpdateConsumoDto dto)
    {
        var consumo = await _context.Consumos.FindAsync(id);
        if (consumo == null) return null;

        consumo.Mes = dto.Mes;
        consumo.ConsumoMwh = dto.ConsumoMwh;

        _context.Consumos.Update(consumo);
        await _context.SaveChangesAsync();

        return consumo;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var consumo = await _context.Consumos.FindAsync(id);
        if (consumo == null) return false;

        _context.Consumos.Remove(consumo);
        await _context.SaveChangesAsync();

        return true;
    }
}
