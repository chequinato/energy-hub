import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Contrato } from '../../models/contrato.model';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 font-sans">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-display text-display-md font-bold text-slate-100">Contratos</h1>
            <p class="text-slate-400 font-light mt-2">Gerenciamento de contratos de energia</p>
          </div>
          <button routerLink="/contratos/novo" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105">
            + Novo Contrato
          </button>
        </div>

        <ng-container *ngIf="carregando(); else lista">
          <div class="flex justify-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/30 border-t-emerald-500"></div>
          </div>
        </ng-container>
        <ng-template #lista>
          <ng-container *ngIf="contratos().length === 0; else tabela">
            <div class="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900 border-2 border-dashed border-slate-700 rounded-2xl">
              <p class="text-lg text-slate-400 font-light">📭 Nenhum contrato cadastrado</p>
              <button routerLink="/contratos/novo" class="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/30">
                Adicionar Primeiro Contrato
              </button>
            </div>
          </ng-container>
          <ng-template #tabela>
            <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-950/80 border-b border-slate-700">
                    <tr>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Fornecedor</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Cliente ID</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Preço/MWh</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Início</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Fim</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-700">
                    <tr *ngFor="let contrato of contratos()" class="hover:bg-slate-700/40 transition-all hover:border-l-4 hover:border-l-emerald-500">
                      <td class="px-6 py-4 text-slate-100 font-medium">{{ contrato.fornecedor }}</td>
                      <td class="px-6 py-4 text-slate-400">
                        <span class="px-2.5 py-1 text-xs font-mono bg-slate-700/40 text-slate-300 rounded">{{ contrato.clienteId }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">R$ {{ contrato.precoMwh | number:'1.2-2' }}</span>
                      </td>
                      <td class="px-6 py-4 text-slate-400 text-sm">
                        📅 {{ contrato.dataInicio | date:'dd/MM/yyyy' }}
                      </td>
                      <td class="px-6 py-4 text-slate-400 text-sm">
                        📅 {{ contrato.dataFim | date:'dd/MM/yyyy' }}
                      </td>
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
export class ContratosPage implements OnInit {
  private apiService = inject(ApiService);
  contratos = signal<Contrato[]>([]);
  carregando = signal(true);

  ngOnInit() {
    this.loadContratos();
  }

  loadContratos() {

    this.contratos.set([]);
    this.carregando.set(true);

    this.apiService.getContratos().subscribe({
      next: (data: Contrato[]) => {
        this.contratos.set(data);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      }
    });
  }
}
