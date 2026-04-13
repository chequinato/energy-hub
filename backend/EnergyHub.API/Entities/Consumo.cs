using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnergyHub.API.Entities;

public class Consumo
{
    public int Id { get; set; }

    public int ClienteId { get; set; }

    [MaxLength(20)]
    public string Mes { get; set; } = string.Empty; // e.g., "2024-01"

    [Column(TypeName = "decimal(10,2)")]
    public decimal ConsumoMwh { get; set; }

    // Navigation property
    [ForeignKey("ClienteId")]
    public Cliente Cliente { get; set; } = null!;
}

