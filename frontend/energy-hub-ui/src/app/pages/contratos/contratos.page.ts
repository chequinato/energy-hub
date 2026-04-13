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
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-6 px-4">
      <div class="max-w-6xl mx-auto space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight">Contratos</h2>
            <p class="text-sm text-slate-400">Gerenciamento de contratos de energia</p>
          </div>
          <button routerLink="/contratos/novo" class="inline-flex items-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white">
            + Novo
          </button>
        </div>

        <ng-container *ngIf="carregando; else lista">
          <div class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
          </div>
        </ng-container>
        <ng-template #lista>
          <ng-container *ngIf="contratos().length === 0; else tabela">
            <div class="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
              <p class="text-sm text-slate-400">Nenhum contrato cadastrado</p>
              <button routerLink="/contratos/novo" class="mt-3 inline-flex items-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white">
                Adicionar Primeiro
              </button>
            </div>
          </ng-container>
          <ng-template #tabela>
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead class="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Fornecedor</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Cliente ID</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Preço/MWh</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Início</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Fim</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    <tr *ngFor="let contrato of contratos()" class="hover:bg-slate-800/50 transition-all">
                      <td class="px-4 py-3 text-slate-100 font-medium">{{ contrato.fornecedor }}</td>
                      <td class="px-4 py-3 text-slate-400">{{ contrato.clienteId }}</td>
                      <td class="px-4 py-3 font-semibold text-amber-400">R$ {{ contrato.precoMwh | number:'1.2-2' }}</td>
                      <td class="px-4 py-3 text-slate-400">{{ contrato.dataInicio | date:'dd/MM/yyyy' }}</td>
                      <td class="px-4 py-3 text-slate-400">{{ contrato.dataFim | date:'dd/MM/yyyy' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ng-template>
        </ng-template>
      </div>
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
