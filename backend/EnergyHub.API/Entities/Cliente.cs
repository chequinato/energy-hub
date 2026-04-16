using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnergyHub.API.Entities;

public class Cliente
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Cnpj { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10,2)")]
    public decimal ConsumoMedio { get; set; }

    [MaxLength(50)]
    public string Regiao { get; set; } = string.Empty;

    // Navigation properties
    public List<Contrato> Contratos { get; set; } = new();
    public List<Consumo> Consumos { get; set; } = new();

    public int UsuarioId { get; set; } // 👈 ESSENCIAL
    public Usuario Usuario { get; set; }
}

