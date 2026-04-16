using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EnergyHub.API.DTOs;
using EnergyHub.API.Services;
using System.Security.Claims;

namespace EnergyHub.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("Token inválido");

        return int.Parse(userIdClaim);
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        var userId = GetUserId();
        var dashboard = await _dashboardService.GetDashboardAsync(userId);
        return Ok(dashboard);
    }
}
