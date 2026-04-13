
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cliente } from '../../models/cliente.model';
import { EconomiaSimulacao } from '../../models/economia.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 font-sans">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- HEADER -->
        <div>
          <h1 class="font-display text-display-md font-bold text-slate-100">Dashboard de Energia</h1>
          <p class="text-slate-400 font-light mt-2">Resumo geral de seus clientes e contratos em tempo real</p>
        </div>

        <!-- CARDS RESUMO -->
        <div class="grid gap-6 md:grid-cols-4">
          <div class="bg-gradient-to-br from-sky-900/50 to-slate-900 border border-sky-700/30 rounded-2xl p-6 hover:border-sky-500/60 transition-all hover:shadow-lg hover:shadow-sky-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-sky-300 uppercase tracking-wider font-semibold">Total Clientes</p>
              <span class="text-2xl">👥</span>
            </div>
            <p class="text-4xl font-bold text-sky-400">{{ clientesCount }}</p>
            <p class="mt-3 text-xs text-sky-200/70">Cadastrados no sistema</p>
          </div>

          <div class="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-700/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Contratos Ativos</p>
              <span class="text-2xl">📄</span>
            </div>
            <p class="text-4xl font-bold text-emerald-400">{{ contratosCount }}</p>
            <p class="mt-3 text-xs text-emerald-200/70">Contratos vigentes</p>
          </div>

          <div class="bg-gradient-to-br from-amber-900/50 to-slate-900 border border-amber-700/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-amber-300 uppercase tracking-wider font-semibold">Consumo Médio</p>
              <span class="text-2xl">⚡</span>
            </div>
            <p class="text-4xl font-bold text-amber-400">{{ consumoMedio | number:'1.0-0' }}</p>
            <p class="mt-3 text-xs text-amber-200/70">MWh/mês total</p>
          </div>

          <div class="bg-gradient-to-br from-orange-900/50 to-slate-900 border border-orange-700/30 rounded-2xl p-6 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-orange-300 uppercase tracking-wider font-semibold">Tarifa Média</p>
              <span class="text-2xl">💰</span>
            </div>
            <p class="text-4xl font-bold text-orange-400">R$ {{ tarifaMedia | number:'1.2-2' }}</p>
            <p class="mt-3 text-xs text-orange-200/70">Por MWh</p>
          </div>
        </div>

        <!-- MAIN GRID -->
        <div class="grid gap-6 md:grid-cols-[2fr,1.2fr]">
          <!-- Clientes Recentes -->
          <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all">
            <div class="mb-6">
              <p class="text-sm text-slate-400 uppercase tracking-wider font-semibold">🏢 Clientes Recentes</p>
            </div>
            
            @if (carregandoClientes()) {
              <div class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-sky-500/30 border-t-sky-500"></div>
              </div>
            } @else {
              <ul class="space-y-3" *ngIf="ultimosClientes.length; else semClientes">
                <li *ngFor="let c of ultimosClientes" class="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg hover:border-sky-500/40 transition-all hover:bg-slate-800/50">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-slate-100 font-semibold">{{ c.nome }}</p>
                      <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        📍 {{ c.regiao }}
                      </p>
                    </div>
                    <span class="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{{ c.consumoMedio | number:'1.0-0' }} MWh</span>
                  </div>
                </li>
              </ul>
              <ng-template #semClientes>
                <p class="text-sm text-slate-500 text-center py-8">📭 Cadastre clientes para ver o histórico.</p>
              </ng-template>
            }
          </div>

          <!-- Simulação de Economia -->
          <div class="bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-700/30 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
            <p class="text-sm text-emerald-400 uppercase tracking-wider font-semibold mb-6">💡 Simulação de Economia</p>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-slate-300 mb-2 font-semibold">Cliente</label>
                <select [(ngModel)]="selectedClienteId" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                  <option value="">Selecione um cliente</option>
                  @for (cliente of clientes(); track cliente.id) {
                    <option [value]="cliente.id">{{ cliente.nome }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-xs text-slate-300 mb-2 font-semibold">Preço (R$/MWh)</label>
                <input [(ngModel)]="precoAtual" type="number" step="0.01" placeholder="0.00"
                       class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500">
              </div>

              <button (click)="calcular()" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105">
                🔍 Calcular Economia
              </button>

              @if (resultado()) {
                <div class="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg mt-4">
                  <p class="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Resultado</p>
                  <p class="text-2xl font-bold text-emerald-400 mt-2">{{ resultado()?.economiaPercentual | number:'1.1-1' }}%</p>
                  <p class="text-sm text-emerald-300 mt-3">
                    💰 R$ {{ resultado()?.economiaValor | number:'1.2-2' }}/mês de economia
                  </p>
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class DashboardPage {
  private apiService = inject(ApiService);
  
  clientes = signal<Cliente[]>([]);
  carregandoClientes = signal(true);
  selectedClienteId = signal(0);
  precoAtual = '';
  resultado = signal<EconomiaSimulacao | null>(null);
  
  clientesCount = 0;
  contratosCount = 0;
  consumoMedio = 0;
  tarifaMedia = 0;
  ultimosClientes: Cliente[] = [];

  constructor() {
    this.loadClientes();
  }

  loadClientes() {
    this.apiService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes.set(data);
        this.ultimosClientes = data.slice(0, 5);
        this.clientesCount = data.length;
        this.consumoMedio = data.reduce((acc, c) => acc + c.consumoMedio, 0);
        this.carregandoClientes.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar clientes:', err);
        this.carregandoClientes.set(false);
      }
    });
    
    this.apiService.getContratos().subscribe({
      next: (data: any[]) => {
        this.contratosCount = data.length;
        if (data.length > 0) {
          this.tarifaMedia = data.reduce((acc, c) => acc + c.precoMwh, 0) / data.length;
        }
      },
      error: (err: any) => console.error('Erro ao carregar contratos:', err)
    });
  }

  calcular() {
    const id = this.selectedClienteId();
    if (id && this.precoAtual) {
      this.apiService.calcularEconomia(id, parseFloat(this.precoAtual)).subscribe({
        next: (data: EconomiaSimulacao) => this.resultado.set(data),
        error: (err: any) => console.error('Erro simulação:', err)
      });
    }
  }
}

