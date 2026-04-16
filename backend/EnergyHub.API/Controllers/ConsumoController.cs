using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EnergyHub.API.Services;
using EnergyHub.API.DTOs;
using System.Security.Claims;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConsumoController : ControllerBase
{
    private readonly IConsumoService _service;

    public ConsumoController(IConsumoService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("Token inválido");

        return int.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<ActionResult<List<ConsumoDto>>> GetAll()
    {
        var userId = GetUserId();
        var consumos = await _service.GetAllAsync(userId);
        return Ok(consumos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConsumoDto>> GetById(int id)
    {
        var userId = GetUserId();
        var consumo = await _service.GetByIdAsync(id, userId);
        if (consumo == null)
            return NotFound();

        return Ok(consumo);
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<ActionResult<List<ConsumoDto>>> GetByClienteId(int clienteId)
    {
        var consumos = await _service.GetByClienteIdAsync(clienteId);
        return Ok(consumos);
    }

    [HttpGet("cliente/{clienteId}/media")]
    public async Task<ActionResult<object>> GetConsumoMedio(int clienteId)
    {
        var media = await _service.GetConsumoMedioClienteAsync(clienteId);
        return Ok(new { consumoMedioMensal = media });
    }

    [HttpPost]
    public async Task<ActionResult<ConsumoDto>> Create(CreateConsumoDto dto)
    {
        try
        {
            var userId = GetUserId();
            dto.UsuarioId = userId;
            var consumo = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = consumo.Id }, consumo);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ConsumoDto>> Update(int id, UpdateConsumoDto dto)
    {
        var consumo = await _service.UpdateAsync(id, dto);
        if (consumo == null)
            return NotFound();

        return Ok(consumo);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var success = await _service.DeleteAsync(id, userId);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
