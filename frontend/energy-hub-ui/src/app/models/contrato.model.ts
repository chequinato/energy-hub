export interface Contrato {
  id: number;
  clienteId: number;
  precoMwh: number;
  fornecedor: string;
  dataInicio: string; // ISO date
  dataFim: string;
}

export interface CreateContrato {
  clienteId: number;
  precoMwh: number;
  fornecedor: string;
  dataInicio: string;
  dataFim: string;
}

