namespace EnergyHub.API.DTOs;

public class UpdateClienteDto
{
    public string? Nome { get; set; }
    public string? Cnpj { get; set; }
    public decimal? ConsumoMedio { get; set; }
    public string? Regiao { get; set; }
}
