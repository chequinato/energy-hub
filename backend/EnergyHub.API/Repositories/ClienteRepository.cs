using Microsoft.EntityFrameworkCore;
using EnergyHub.API.Data;
using EnergyHub.API.Entities;
using EnergyHub.API.DTOs;

namespace EnergyHub.API.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly ApplicationDbContext _context;

    public ClienteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cliente>> GetAllAsync(int userId)
    {
        return await _context.Clientes
            .Where(c => c.UsuarioId == userId)
            .Include(c => c.Contratos)
            .Include(c => c.Consumos)
            .ToListAsync();
    }

    public async Task<Cliente?> GetByIdAsync(int id, int userId)
    {
        return await _context.Clientes
            .Where(c => c.Id == id && c.UsuarioId == userId)
            .Include(c => c.Contratos)
            .Include(c => c.Consumos)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ExistsAsync(int id, int userId)
    {
        return await _context.Clientes
            .AnyAsync(c => c.Id == id && c.UsuarioId == userId);
    }

    public async Task<Cliente> CreateAsync(CreateClienteDto dto, int userId)
    {
        var cliente = new Cliente
        {
            Nome = dto.Nome,
            Cnpj = dto.Cnpj,
            ConsumoMedio = dto.ConsumoMedio,
            Regiao = dto.Regiao,
            UsuarioId = userId
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return cliente;
    }

    public async Task<Cliente?> UpdateAsync(int id, UpdateClienteDto dto, int userId)
    {
        var cliente = await _context.Clientes
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == userId);

        if (cliente == null) return null;

        if (dto.Nome != null) cliente.Nome = dto.Nome;
        if (dto.Cnpj != null) cliente.Cnpj = dto.Cnpj;
        if (dto.ConsumoMedio.HasValue) cliente.ConsumoMedio = dto.ConsumoMedio.Value;
        if (dto.Regiao != null) cliente.Regiao = dto.Regiao;

        await _context.SaveChangesAsync();
        return cliente;
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var cliente = await _context.Clientes
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == userId);

        if (cliente == null) return false;

        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync();
        return true;
    }
}