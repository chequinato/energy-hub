using Microsoft.AspNetCore.Mvc;
using EnergyHub.API.DTOs;
using EnergyHub.API.Services;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly ClienteService _clienteService;

    public ClientesController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ClienteDto>>> GetClientes()
    {
        var clientes = await _clienteService.GetAllAsync();
        return Ok(clientes);
    }

    [HttpGet("com-detalhes")]
    public async Task<ActionResult<List<ClienteDetailDto>>> GetClientesWithDetails()
    {
        var clientes = await _clienteService.GetAllWithDetailsAsync();
        return Ok(clientes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var cliente = await _clienteService.GetByIdAsync(id);
        if (cliente == null)
        {
            return NotFound();
        }
        return Ok(cliente);
    }

    [HttpGet("{id}/detalhes")]
    public async Task<ActionResult<ClienteDetailDto>> GetClienteWithDetails(int id)
    {
        var cliente = await _clienteService.GetByIdWithDetailsAsync(id);
        if (cliente == null)
        {
            return NotFound();
        }
        return Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
    {
        var cliente = await _clienteService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ClienteDto>> UpdateCliente(int id, UpdateClienteDto dto)
    {
        var cliente = await _clienteService.UpdateAsync(id, dto);
        if (cliente == null)
        {
            return NotFound();
        }
        return Ok(cliente);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var success = await _clienteService.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpGet("{clienteId}/economia")]
    public async Task<ActionResult<EconomiaSimulacaoDto>> CalcularEconomiaComContrato(
        int clienteId,
        [FromQuery] decimal precoAtual)
    {
        try
        {
            var economia = await _clienteService.SimularEconomiaComContratoAsync(clienteId, precoAtual);
            return Ok(economia);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{clienteId}/simular-economia")]
    public async Task<ActionResult<EconomiaSimulacaoDto>> SimularEconomiaComContrato(
        int clienteId,
        [FromQuery] decimal precoMercadoAtualMwh)
    {
        try
        {
            var economia = await _clienteService.SimularEconomiaComContratoAsync(clienteId, precoMercadoAtualMwh);
            return Ok(economia);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

