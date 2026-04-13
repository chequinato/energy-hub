using Microsoft.AspNetCore.Mvc;
using EnergyHub.API.DTOs;
using EnergyHub.API.Services;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContratosController : ControllerBase
{
    private readonly IContratoService _contratoService;

    public ContratosController(IContratoService contratoService)
    {
        _contratoService = contratoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContratoDto>>> GetContratos()
    {
        var contratos = await _contratoService.GetAllAsync();
        return Ok(contratos);
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<ActionResult<List<ContratoDto>>> GetContratosByCliente(int clienteId)
    {
        var contratos = await _contratoService.GetByClienteIdAsync(clienteId);
        return Ok(contratos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContratoDto>> GetContrato(int id)
    {
        var contrato = await _contratoService.GetByIdAsync(id);
        if (contrato == null)
        {
            return NotFound();
        }
        return Ok(contrato);
    }

    [HttpPost]
    public async Task<ActionResult<ContratoDto>> CreateContrato(CreateContratoDto dto)
    {
        var contrato = await _contratoService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetContrato), new { id = contrato.Id }, contrato);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ContratoDto>> UpdateContrato(int id, CreateContratoDto dto)
    {
        var contrato = await _contratoService.UpdateAsync(id, dto);
        if (contrato == null)
        {
            return NotFound();
        }
        return Ok(contrato);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContrato(int id)
    {
        var success = await _contratoService.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}

