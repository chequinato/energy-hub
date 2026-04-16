using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnergyHub.API.Entities;

public class Contrato
{
    public int Id { get; set; }

    public int ClienteId { get; set; }

    [Column(TypeName = "decimal(10,4)")]
    public decimal PrecoMwh { get; set; }

    [MaxLength(100)]
    public string Fornecedor { get; set; } = string.Empty;

    public DateOnly DataInicio { get; set; }

    public DateOnly DataFim { get; set; }

    // Navigation property
    [ForeignKey("ClienteId")]
    public Cliente Cliente { get; set; } = null!;

    public int UsuarioId { get; set; } // 👈 ESSENCIAL
    public Usuario Usuario { get; set; }
}

