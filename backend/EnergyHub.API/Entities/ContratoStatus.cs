namespace EnergyHub.API.Entities;

public enum ContratoStatus
{
    Futuro = 0,    // Data de início no futuro
    Ativo = 1,     // Entre data de início e fim
    Expirado = 2   // Data de fim no passado
}
