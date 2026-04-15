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
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-display-md font-mono font-semibold tracking-[-0.03em] text-slate-50">Contratos</h1>
          <p class="eh-muted mt-2">Gerenciamento de contratos de energia.</p>
        </div>
        <button
          routerLink="/contratos/novo"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-3 font-semibold transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(16,185,129,0.55)] hover:scale-[1.02]"
        >
          <span class="text-base">+</span> Novo contrato
        </button>
      </div>

      <ng-container *ngIf="carregando(); else lista">
        <div class="eh-card p-6">
          <div class="flex items-center justify-between">
            <div class="eh-skeleton-title w-40"></div>
            <div class="eh-skeleton h-9 w-24 rounded-xl"></div>
          </div>
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="eh-skeleton h-10 rounded-xl"></div>
            <div class="eh-skeleton h-10 rounded-xl"></div>
            <div class="eh-skeleton h-10 rounded-xl"></div>
            <div class="eh-skeleton h-10 rounded-xl"></div>
          </div>
        </div>
      </ng-container>

      <ng-template #lista>
        <ng-container *ngIf="contratos().length === 0; else tabela">
          <div class="eh-card p-10 text-center border-dashed">
            <p class="text-sm uppercase tracking-[0.16em] text-slate-400 font-semibold">Vazio</p>
            <p class="text-lg text-slate-100 font-semibold mt-3">Nenhum contrato cadastrado</p>
            <p class="text-sm text-slate-500 mt-2">Crie o primeiro contrato para vincular clientes e tarifas.</p>
            <button
              routerLink="/contratos/novo"
              class="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 text-white px-6 py-3 font-semibold transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(16,185,129,0.55)]"
            >
              Criar primeiro contrato
            </button>
          </div>
        </ng-container>

        <ng-template #tabela>
          <!-- Box com bordas arredondadas + glow atrás -->
          <div class="relative">
            <div class="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 blur-2xl"></div>
            <div class="relative eh-card rounded-[28px] overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-950/50 border-b border-slate-800/70">
                    <tr>
                      <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Fornecedor</th>
                      <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Cliente ID</th>
                      <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Preço/MWh</th>
                      <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Início</th>
                      <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Fim</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/70">
                    <tr *ngFor="let contrato of contratos()" class="hover:bg-slate-950/30 transition-all duration-300">
                      <td class="px-6 py-4 text-slate-50 font-semibold tracking-wide">{{ contrato.fornecedor }}</td>
                      <td class="px-6 py-4 text-slate-400">
                        <span class="eh-badge eh-badge-neutral font-mono">{{ contrato.clienteId }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="font-semibold text-amber-200">R$ {{ contrato.precoMwh | number:'1.2-2' }}</span>
                      </td>
                      <td class="px-6 py-4 text-slate-400 text-sm">{{ contrato.dataInicio | date:'dd/MM/yyyy' }}</td>
                      <td class="px-6 py-4 text-slate-400 text-sm">{{ contrato.dataFim | date:'dd/MM/yyyy' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ng-template>
      </ng-template>
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
