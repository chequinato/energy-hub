export interface ClienteEconomia {
  clienteId: number;
  nomeCliente: string;
  consumoMedioMensal: number;
  consumoEstimado: number;
  variacaoPercentual: number;
  tendenciaPercentual: number;
  economiaEstimada: number;
  fornecedor: string;
}

export interface Dashboard {
  totalContratos: number;
  totalContratosAtivos: number;
  totalContratosExpirados: number;
  totalContratosFuturos: number;
  totalClientes: number;
  clientesComContratoAtivo: number;
  economiaTotal: number;
  economiaMensal: number;
  
  // Novo: Métricas de Consumo
  consumoTotalRegistrado: number;
  consumoMedioGeral: number;
  variacaoMediaConsumoCli: number;
  tendenciaMediaConsumoCli: number;

  topClientesEconomia: ClienteEconomia[];
}
