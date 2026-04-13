export interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  consumoMedio: number;
  regiao: string;
}

export interface CreateCliente {
  nome: string;
  cnpj: string;
  consumoMedio: number;
  regiao: string;
}

export interface UpdateCliente {
  nome?: string;
  cnpj?: string;
  consumoMedio?: number;
  regiao?: string;
}

