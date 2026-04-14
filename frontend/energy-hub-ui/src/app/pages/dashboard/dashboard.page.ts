
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ClienteDetail } from '../../models/cliente-detail.model';
import { EconomiaSimulacao } from '../../models/economia.model';
import { Dashboard } from '../../models/dashboard.model';

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
            <p class="text-4xl font-bold text-sky-400">{{ dashboard()?.totalClientes ?? 0 }}</p>
            <p class="mt-3 text-xs text-sky-200/70">Cadastrados no sistema</p>
          </div>

          <div class="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-700/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Contratos Ativos</p>
              <span class="text-2xl">📄</span>
            </div>
            <p class="text-4xl font-bold text-emerald-400">{{ dashboard()?.totalContratosAtivos ?? 0 }}</p>
            <p class="mt-3 text-xs text-emerald-200/70">Contratos vigentes</p>
          </div>

          <div class="bg-gradient-to-br from-amber-900/50 to-slate-900 border border-amber-700/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-amber-300 uppercase tracking-wider font-semibold">Clientes com contrato</p>
              <span class="text-2xl">🏷️</span>
            </div>
            <p class="text-4xl font-bold text-amber-400">{{ dashboard()?.clientesComContratoAtivo ?? 0 }}</p>
            <p class="mt-3 text-xs text-amber-200/70">Contratos ativos por cliente</p>
          </div>

          <div class="bg-gradient-to-br from-orange-900/50 to-slate-900 border border-orange-700/30 rounded-2xl p-6 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-orange-300 uppercase tracking-wider font-semibold">Economia anual</p>
              <span class="text-2xl">💰</span>
            </div>
            <p class="text-4xl font-bold text-orange-400">R$ {{ dashboard()?.economiaTotal | number:'1.0-0' }}</p>
            <p class="mt-3 text-xs text-orange-200/70">Com base em contratos ativos</p>
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
                  @for (cliente of clientesComContratoAtivo; track cliente.id) {
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

              @if (erroMessage()) {
                <div class="p-4 bg-red-500/10 border border-red-500/40 rounded-lg mt-4">
                  <p class="text-xs text-red-300 uppercase tracking-wider font-semibold">Erro</p>
                  <p class="text-sm text-red-300 mt-2">{{ erroMessage() }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Ranking de Clientes -->
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all">
          <div class="mb-6">
            <p class="text-sm text-slate-400 uppercase tracking-wider font-semibold">🏆 Ranking de Clientes</p>
            <p class="text-xs text-slate-500 mt-1">Clientes com maior economia estimada com contrato ativo</p>
          </div>

          @if (dashboard()?.topClientesEconomia?.length) {
            <ul class="space-y-3">
              <li *ngFor="let cliente of dashboard()?.topClientesEconomia; let i = index" class="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg">
                <div>
                  <p class="text-slate-100 font-semibold">#{{ i + 1 }} {{ cliente.nomeCliente }}</p>
                  <p class="text-xs text-slate-500 mt-1">Fornecedor: {{ cliente.fornecedor }}</p>
                </div>
                <span class="text-lg font-bold text-amber-400">R$ {{ cliente.economiaEstimada | number:'1.0-0' }}</span>
              </li>
            </ul>
          } @else {
            <p class="text-sm text-slate-500 text-center py-8">Nenhum cliente com contrato ativo disponível para ranking.</p>
          }
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class DashboardPage {
  private apiService = inject(ApiService);
  
  dashboard = signal<Dashboard | null>(null);
  clientes = signal<ClienteDetail[]>([]);
  clientesComContratoAtivo: ClienteDetail[] = [];
  carregandoClientes = signal(true);
  carregandoDashboard = signal(true);
  selectedClienteId = signal<number | null>(null);
  precoAtual = '';
  resultado = signal<EconomiaSimulacao | null>(null);
  erroMessage = signal<string>('');
  ultimosClientes: ClienteDetail[] = [];

  constructor() {
    this.loadDashboard();
    this.loadClientes();
  }

  loadDashboard() {
    this.apiService.getDashboard().subscribe({
      next: (data: Dashboard) => {
        this.dashboard.set(data);
        this.carregandoDashboard.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar dashboard:', err);
        this.carregandoDashboard.set(false);
      }
    });
  }

  loadClientes() {
    this.apiService.getClientesWithDetails().subscribe({
      next: (data: ClienteDetail[]) => {
        const sorted = data.sort((a, b) => b.id - a.id);
        this.clientes.set(sorted);
        this.ultimosClientes = sorted.slice(0, 5);
        this.clientesComContratoAtivo = sorted.filter(c => c.contratoAtivo != null);
        this.carregandoClientes.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar clientes:', err);
        this.carregandoClientes.set(false);
      }
    });
  }

  calcular() {
    const id = this.selectedClienteId();
    if (id && this.precoAtual) {
      this.erroMessage.set('');
      this.apiService.calcularEconomia(id, parseFloat(this.precoAtual)).subscribe({
        next: (data: EconomiaSimulacao) => this.resultado.set(data),
        error: (err: any) => {
          console.error('Erro simulação:', err);
          this.resultado.set(null);
          if (err.status === 400) {
            this.erroMessage.set('Cliente não possui contrato ativo válido para simulação.');
            // Recarregar lista de clientes para atualizar status
            this.loadClientes();
          } else {
            this.erroMessage.set('Erro ao calcular economia. Tente novamente.');
          }
        }
      });
    }
  }
}

