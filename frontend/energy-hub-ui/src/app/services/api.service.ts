import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, CreateCliente, UpdateCliente } from '../models/cliente.model';
import { Contrato, CreateContrato } from '../models/contrato.model';
import { EconomiaSimulacao } from '../models/economia.model';

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
    return this.http.get<EconomiaSimulacao>(`${this.baseUrl}/clientes/${clienteId}/economia?precoAtual=${precoAtualMwh}`);
  }
}

