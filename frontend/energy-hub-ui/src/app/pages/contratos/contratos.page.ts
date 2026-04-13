import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Contrato } from '../../models/contrato.model';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          📄 Contratos
        </h1>
        <button routerLink="/contratos/novo" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 shadow-xl transition-all">
          + Novo Contrato
        </button>
      </div>

      <ng-container *ngIf="carregando; else lista">
        <div class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </ng-container>
      <ng-template #lista>
        <ng-container *ngIf="contratos().length === 0; else tabela">
          <div class="text-center py-20">
            <div class="w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              📄
            </div>
            <h3 class="text-2xl font-bold text-gray-600 mb-4">Nenhum contrato cadastrado</h3>
            <p class="text-gray-500 mb-8">Comece adicionando seu primeiro contrato.</p>
            <button routerLink="/contratos/novo" class="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 shadow-xl transition-all">
              Adicionar Primeiro Contrato
            </button>
          </div>
        </ng-container>
        <ng-template #tabela>
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Fornecedor</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">ClienteId</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Preço (R$/MWh)</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Início</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Fim</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let contrato of contratos()">
                    <td class="px-8 py-6 font-semibold text-gray-900">{{ contrato.fornecedor }}</td>
                    <td class="px-8 py-6 text-gray-700">{{ contrato.clienteId }}</td>
                    <td class="px-8 py-6 font-bold text-orange-600">{{ contrato.precoMwh | number:'1.2-2' }}</td>
                    <td class="px-8 py-6">{{ contrato.dataInicio | date:'yyyy-MM-dd' }}</td>
                    <td class="px-8 py-6">{{ contrato.dataFim | date:'yyyy-MM-dd' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `
})
export class ContratosPage {
  private apiService = inject(ApiService);
  contratos = signal<Contrato[]>([]);
  carregando = true;

  constructor() {
    this.loadContratos();
  }

  loadContratos() {
    this.apiService.getContratos().subscribe({
      next: (data: Contrato[]) => {
        this.contratos.set(data);
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }
}
