using Microsoft.EntityFrameworkCore;
using EnergyHub.API.Data;
using EnergyHub.API.Entities;
using EnergyHub.API.DTOs;
using EnergyHub.API.Repositories;

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
        .Include(c => c.Contratos)
        .Include(c => c.Consumos)
        .ToListAsync();
}

    public async Task<Cliente?> GetByIdAsync(int id)
{
    return await _context.Clientes
        .Include(c => c.Contratos)
        .Include(c => c.Consumos)
        .FirstOrDefaultAsync(c => c.Id == id);
}

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Clientes.AnyAsync(c => c.Id == id);
    }

    public async Task<Cliente> CreateAsync(CreateClienteDto dto)
    {
        var cliente = new Cliente
        {
            Nome = dto.Nome,
            Cnpj = dto.Cnpj,
            ConsumoMedio = dto.ConsumoMedio,
            Regiao = dto.Regiao
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return cliente;
    }

    public async Task<Cliente?> UpdateAsync(int id, UpdateClienteDto dto)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return null;

        if (dto.Nome != null) cliente.Nome = dto.Nome;
        if (dto.Cnpj != null) cliente.Cnpj = dto.Cnpj;
        if (dto.ConsumoMedio.HasValue) cliente.ConsumoMedio = dto.ConsumoMedio.Value;
        if (dto.Regiao != null) cliente.Regiao = dto.Regiao;

        await _context.SaveChangesAsync();

        return cliente;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return false;

        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync();

        return true;
    }
}

