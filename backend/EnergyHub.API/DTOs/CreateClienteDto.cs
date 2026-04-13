namespace EnergyHub.API.DTOs;

public class CreateClienteDto
{
    public string Nome { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public decimal ConsumoMedio { get; set; }
    public string Regiao { get; set; } = string.Empty;
}
