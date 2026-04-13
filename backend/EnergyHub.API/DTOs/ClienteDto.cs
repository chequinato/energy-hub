namespace EnergyHub.API.DTOs;

public class ClienteDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public decimal ConsumoMedio { get; set; }
    public string Regiao { get; set; } = string.Empty;
}

