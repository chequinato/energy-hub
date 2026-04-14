export interface ClienteEconomia {
  clienteId: number;
  nomeCliente: string;
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
  topClientesEconomia: ClienteEconomia[];
}
