export interface Consumo {
  id: number;
  clienteId: number;
  mes: string;
  consumoMwh: number;
}

export interface CreateConsumo {
  clienteId: number;
  mes: string;
  consumoMwh: number;
}

export interface UpdateConsumo {
  mes: string;
  consumoMwh: number;
}

export interface ConsumoMedio {
  consumoMedioMensal: number;
}
