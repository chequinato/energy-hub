import { Contrato } from './contrato.model';

export interface ClienteDetail {
  id: number;
  nome: string;
  cnpj: string;
  consumoMedio: number;
  regiao: string;

  statusContrato: string;
  economiaEstimada: number;
  contratoAtivo?: Contrato;
}