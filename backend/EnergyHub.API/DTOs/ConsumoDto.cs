namespace EnergyHub.API.DTOs;

public class ConsumoDto
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public string Mes { get; set; } = string.Empty;
    public decimal ConsumoMwh { get; set; }
}

public class CreateConsumoDto
{
    public int ClienteId { get; set; }
    public string Mes { get; set; } = string.Empty;
    public decimal ConsumoMwh { get; set; }
    public int UsuarioId { get; set; }
}

public class UpdateConsumoDto
{
    public string Mes { get; set; } = string.Empty;
    public decimal ConsumoMwh { get; set; }
}
