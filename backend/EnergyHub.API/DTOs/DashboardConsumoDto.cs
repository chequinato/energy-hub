namespace EnergyHub.API.DTOs;

public class DashboardConsumoDto
{
    /// <summary>
    /// Consumo estimado/inicial definido quando cliente foi criado
    /// </summary>
    public decimal ConsumoEstimado { get; set; }

    /// <summary>
    /// Consumo médio calculado a partir do histórico real
    /// </summary>
    public decimal ConsumoMedioReal { get; set; }

    /// <summary>
    /// Diferença entre estimado e real (em %)
    /// Positivo = consumindo menos, Negativo = consumindo mais
    /// </summary>
    public decimal VariacaoPercentual { get; set; }

    /// <summary>
    /// Total consumido em todos os registros
    /// </summary>
    public decimal TotalConsumido { get; set; }

    /// <summary>
    /// Quantidade de meses com dados
    /// </summary>
    public int QuantidadeMeses { get; set; }

    /// <summary>
    /// Tendência dos últimos 3 meses vs anteriores
    /// Positivo = aumentando, Negativo = diminuindo
    /// </summary>
    public decimal TendenciaPercentual { get; set; }

    /// <summary>
    /// Maior consumo registrado
    /// </summary>
    public decimal ConsumoMaximo { get; set; }

    /// <summary>
    /// Menor consumo registrado
    /// </summary>
    public decimal ConsumoMinimo { get; set; }
}
