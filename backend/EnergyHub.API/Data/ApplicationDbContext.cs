using Microsoft.EntityFrameworkCore;
using EnergyHub.API.Entities;

namespace EnergyHub.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Contrato> Contratos { get; set; }
    public DbSet<Consumo> Consumos { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Usuario (Auth)
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Nome)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Email)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.PasswordHash)
                .IsRequired();

            entity.Property(e => e.PasswordSalt)
                .IsRequired();

            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Cliente
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cnpj).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ConsumoMedio).HasColumnType("decimal(10,2)").IsRequired();
            entity.Property(e => e.Regiao).HasMaxLength(50);
            entity.HasIndex(e => e.Cnpj).IsUnique();
        });

        // Contrato
        modelBuilder.Entity<Contrato>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PrecoMwh).HasColumnType("decimal(10,4)").IsRequired();
            entity.Property(e => e.Fornecedor).HasMaxLength(100).IsRequired();
            entity.HasOne(e => e.Cliente)
                  .WithMany(c => c.Contratos)
                  .HasForeignKey(e => e.ClienteId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Consumo
        modelBuilder.Entity<Consumo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ConsumoMwh).HasColumnType("decimal(10,2)").IsRequired();
            entity.Property(e => e.Mes).HasMaxLength(20).IsRequired();
            entity.HasOne(e => e.Cliente)
                  .WithMany(c => c.Consumos)
                  .HasForeignKey(e => e.ClienteId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.ClienteId, e.Mes }).IsUnique();
        });

        base.OnModelCreating(modelBuilder);
    }
}

