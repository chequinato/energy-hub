import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, CreateCliente, UpdateCliente } from '../models/cliente.model';
import { Contrato, CreateContrato } from '../models/contrato.model';
import { Consumo, CreateConsumo, UpdateConsumo, ConsumoMedio } from '../models/consumo.model';
import { EconomiaSimulacao } from '../models/economia.model';
import { ClienteDetail } from '../models/cliente-detail.model';
import { Dashboard } from '../models/dashboard.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5243/api';

  // Clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/clientes`);
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/clientes/${id}`);
  }

  createCliente(cliente: CreateCliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.baseUrl}/clientes`, cliente);
  }

  updateCliente(id: number, cliente: UpdateCliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/clientes/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clientes/${id}`);
  }

  // Contratos
  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/contratos`);
  }

  getContratosByCliente(clienteId: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/contratos/cliente/${clienteId}`);
  }

  getContrato(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.baseUrl}/contratos/${id}`);
  }

  createContrato(contrato: CreateContrato): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.baseUrl}/contratos`, contrato);
  }

  updateContrato(id: number, contrato: CreateContrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.baseUrl}/contratos/${id}`, contrato);
  }

  deleteContrato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/contratos/${id}`);
  }

  calcularEconomia(clienteId: number, precoAtualMwh: number): Observable<EconomiaSimulacao> {
    return this.http.get<EconomiaSimulacao>(
      `${this.baseUrl}/clientes/simular-economia?clienteId=${clienteId}&precoAtualMwh=${precoAtualMwh}`
    );
  }

  getClientesWithDetails(): Observable<ClienteDetail[]> {
    return this.http.get<ClienteDetail[]>(`${this.baseUrl}/clientes/com-detalhes`);
  }

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/dashboard`);
  }

  // Consumos
  getConsumos(): Observable<Consumo[]> {
    return this.http.get<Consumo[]>(`${this.baseUrl}/consumo`);
  }

  getConsumosByCliente(clienteId: number): Observable<Consumo[]> {
    return this.http.get<Consumo[]>(`${this.baseUrl}/consumo/cliente/${clienteId}`);
  }

  getConsumoMedio(clienteId: number): Observable<ConsumoMedio> {
    return this.http.get<ConsumoMedio>(`${this.baseUrl}/consumo/cliente/${clienteId}/media`);
  }

  createConsumo(consumo: CreateConsumo): Observable<Consumo> {
    return this.http.post<Consumo>(`${this.baseUrl}/consumo`, consumo);
  }

  updateConsumo(id: number, consumo: UpdateConsumo): Observable<Consumo> {
    return this.http.put<Consumo>(`${this.baseUrl}/consumo/${id}`, consumo);
  }

  deleteConsumo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/consumo/${id}`);
  }

  // Usuários
  getUsuarioPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/perfil`);
  }
}

