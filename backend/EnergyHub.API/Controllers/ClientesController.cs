using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EnergyHub.API.DTOs;
using EnergyHub.API.Services;
using System.Security.Claims;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientesController : ControllerBase
{
    private readonly ClienteService _clienteService;

    public ClientesController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("Token inválido");

        return int.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<ActionResult<List<ClienteDto>>> GetClientes()
    {
        var userId = GetUserId();
        var clientes = await _clienteService.GetAllAsync(userId);
        return Ok(clientes);
    }

    [HttpGet("com-detalhes")]
    public async Task<ActionResult<List<ClienteDetailDto>>> GetClientesComDetalhes()
    {
        var userId = GetUserId();
        var clientes = await _clienteService.GetAllWithDetailsAsync(userId);
        return Ok(clientes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var userId = GetUserId();
        var cliente = await _clienteService.GetByIdAsync(id, userId);

        if (cliente == null)
            return NotFound();

        return Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
    {
        var userId = GetUserId();
        var cliente = await _clienteService.CreateAsync(dto, userId);

        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ClienteDto>> UpdateCliente(int id, UpdateClienteDto dto)
    {
        var userId = GetUserId();
        var cliente = await _clienteService.UpdateAsync(id, dto, userId);

        if (cliente == null)
            return NotFound();

        return Ok(cliente);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var userId = GetUserId();
        var success = await _clienteService.DeleteAsync(id, userId);

        if (!success)
            return NotFound();

        return NoContent();
    }

    
}