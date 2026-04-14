using EnergyHub.API.Entities;

namespace EnergyHub.API.Services;

public static class ContratoStatusHelper
{
    public static ContratoStatus GetStatus(DateOnly dataInicio, DateOnly dataFim)
    {
        var hoje = DateOnly.FromDateTime(DateTime.Now);

        if (hoje < dataInicio)
            return ContratoStatus.Futuro;
        
        if (hoje > dataFim)
            return ContratoStatus.Expirado;
        
        return ContratoStatus.Ativo;
    }

    public static string GetStatusBadge(ContratoStatus status) => status switch
    {
        ContratoStatus.Ativo => "🟢 Ativo",
        ContratoStatus.Expirado => "🔴 Expirado",
        ContratoStatus.Futuro => "🟡 Futuro",
        _ => "❓ Desconhecido"
    };
}
