using Microsoft.EntityFrameworkCore;
using EnergyHub.API.Data;
using EnergyHub.API.Entities;
using EnergyHub.API.DTOs;
using EnergyHub.API.Repositories;

namespace EnergyHub.API.Repositories;

public class ContratoRepository : IContratoRepository
{
    private readonly ApplicationDbContext _context;

    public ContratoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Contrato>> GetAllAsync()
    {
        return await _context.Contratos.Include(c => c.Cliente).ToListAsync();
    }

    public async Task<List<Contrato>> GetAllAsync(int userId)
    {
        return await _context.Contratos
            .Where(c => c.UsuarioId == userId)
            .Include(c => c.Cliente)
            .ToListAsync();
    }

    public async Task<List<Contrato>> GetByClienteIdAsync(int clienteId)
    {
        return await _context.Contratos.Where(c => c.ClienteId == clienteId).Include(c => c.Cliente).ToListAsync();
    }

    public async Task<Contrato?> GetByIdAsync(int id)
    {
        return await _context.Contratos.Include(c => c.Cliente).FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Contrato?> GetByIdAsync(int id, int userId)
    {
        return await _context.Contratos
            .Where(c => c.Id == id && c.UsuarioId == userId)
            .Include(c => c.Cliente)
            .FirstOrDefaultAsync();
    }

    public async Task<Contrato> CreateAsync(CreateContratoDto dto)
    {
        var contrato = new Contrato
        {
            ClienteId = dto.ClienteId,
            PrecoMwh = dto.PrecoMwh,
            Fornecedor = dto.Fornecedor,
            DataInicio = dto.DataInicio,
            DataFim = dto.DataFim,
            UsuarioId = dto.UsuarioId
        };

        _context.Contratos.Add(contrato);
        await _context.SaveChangesAsync();

        return contrato;
    }

    public async Task<Contrato?> UpdateAsync(int id, CreateContratoDto dto)
    {
        var contrato = await _context.Contratos.FindAsync(id);
        if (contrato == null) return null;

        contrato.ClienteId = dto.ClienteId;
        contrato.PrecoMwh = dto.PrecoMwh;
        contrato.Fornecedor = dto.Fornecedor;
        contrato.DataInicio = dto.DataInicio;
        contrato.DataFim = dto.DataFim;

        await _context.SaveChangesAsync();

        return contrato;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var contrato = await _context.Contratos.FindAsync(id);
        if (contrato == null) return false;

        _context.Contratos.Remove(contrato);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var contrato = await _context.Contratos
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == userId);
        if (contrato == null) return false;

        _context.Contratos.Remove(contrato);
        await _context.SaveChangesAsync();

        return true;
    }
}

