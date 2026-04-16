using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EnergyHub.API.DTOs;
using EnergyHub.API.Services;
using System.Security.Claims;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContratosController : ControllerBase
{
    private readonly IContratoService _contratoService;

    public ContratosController(IContratoService contratoService)
    {
        _contratoService = contratoService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("Token inválido");

        return int.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<ActionResult<List<ContratoDto>>> GetContratos()
    {
        var userId = GetUserId();
        var contratos = await _contratoService.GetAllAsync(userId);
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
        var userId = GetUserId();
        var contrato = await _contratoService.GetByIdAsync(id, userId);
        if (contrato == null)
        {
            return NotFound();
        }
        return Ok(contrato);
    }

    [HttpPost]
    public async Task<ActionResult<ContratoDto>> CreateContrato(CreateContratoDto dto)
    {
        var userId = GetUserId();
        dto.UsuarioId = userId;
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
        var userId = GetUserId();
        var success = await _contratoService.DeleteAsync(id, userId);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}

