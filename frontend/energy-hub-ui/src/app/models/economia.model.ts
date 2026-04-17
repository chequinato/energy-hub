export interface EconomiaSimulacao {
  clienteId: number;
  nomeCliente: string;
  consumoMedioMensal: number;
  precoAtualMwh: number;
  precoContratoMwh: number;
  economiaMensal: number;
  economiaAnual: number;
  possuiContratoAtivo: boolean;
}