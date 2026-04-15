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
          <p class="text-slate-400 font-light mt-2">Resumo geral com análise de consumo e economia - Consumo real vs estimado</p>
        </div>

        <!-- Error Message -->
        @if (erroDashboard()) {
          <div class="p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
            <p class="text-sm text-red-300">{{ erroDashboard() }}</p>
          </div>
        }

        <!-- CARDS RESUMO -->
        <div class="grid gap-6 md:grid-cols-5">
          <div class="bg-gradient-to-br from-sky-900/50 to-slate-900 border border-sky-700/30 rounded-2xl p-6 hover:border-sky-500/60 transition-all hover:shadow-lg hover:shadow-sky-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-sky-300 uppercase tracking-wider font-semibold">Total Clientes</p>
              <span class="text-2xl">👥</span>
            </div>
            <p class="text-4xl font-bold text-sky-400">{{ dashboard()?.totalClientes ?? 0 }}</p>
          </div>

          <div class="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-700/30 rounded-2xl p-6 hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Contratos Ativos</p>
              <span class="text-2xl">📄</span>
            </div>
            <p class="text-4xl font-bold text-emerald-400">{{ dashboard()?.totalContratosAtivos ?? 0 }}</p>
          </div>

          <div class="bg-gradient-to-br from-amber-900/50 to-slate-900 border border-amber-700/30 rounded-2xl p-6 hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-amber-300 uppercase tracking-wider font-semibold">Com Contrato</p>
              <span class="text-2xl">🏷️</span>
            </div>
            <p class="text-4xl font-bold text-amber-400">{{ dashboard()?.clientesComContratoAtivo ?? 0 }}</p>
          </div>

          <div class="bg-gradient-to-br from-orange-900/50 to-slate-900 border border-orange-700/30 rounded-2xl p-6 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-orange-300 uppercase tracking-wider font-semibold">Economia Anual</p>
              <span class="text-2xl">💰</span>
            </div>
            <p class="text-4xl font-bold text-orange-400">R$ {{ dashboard()?.economiaTotal | number:'1.0-0' }}</p>
          </div>

          <div class="bg-gradient-to-br from-cyan-900/50 to-slate-900 border border-cyan-700/30 rounded-2xl p-6 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs text-cyan-300 uppercase tracking-wider font-semibold">Consumo Média</p>
              <span class="text-2xl">📊</span>
            </div>
            <p class="text-4xl font-bold text-cyan-400">{{ dashboard()?.consumoMedioGeral | number:'1.0-0' }} MWh</p>
          </div>
        </div>

        <!-- ANÁLISE GERAL DE CONSUMO -->
        <div class="bg-gradient-to-br from-cyan-900/30 to-slate-900 border border-cyan-700/30 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
          <p class="text-sm text-cyan-400 uppercase tracking-wider font-semibold mb-6">📊 Análise de Consumo Geral</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <p class="text-xs text-slate-400 mb-2">Total Registrado</p>
              <p class="text-2xl font-bold text-cyan-400">{{ dashboard()?.consumoTotalRegistrado | number:'1.0-0' }} MWh</p>
            </div>
            <div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <p class="text-xs text-slate-400 mb-2">Consumo Médio</p>
              <p class="text-2xl font-bold text-cyan-400">{{ dashboard()?.consumoMedioGeral | number:'1.0-0' }} MWh</p>
            </div>
            <div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <p class="text-xs text-slate-400 mb-2">Variação Média</p>
              <p [class]="(dashboard()?.variacaoMediaConsumoCli ?? 0) <= 0 ? 'text-emerald-400' : 'text-red-400'" class="text-2xl font-bold">
                {{ dashboard()?.variacaoMediaConsumoCli | number:'1.1-1' }}%
              </p>
              <p class="text-xs text-slate-500 mt-1">(Real vs Estimado)</p>
            </div>
            <div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <p class="text-xs text-slate-400 mb-2">Tendência Geral</p>
              <p [class]="(dashboard()?.tendenciaMediaConsumoCli ?? 0) <= 0 ? 'text-emerald-400' : 'text-amber-400'" class="text-2xl font-bold">
                {{ dashboard()?.tendenciaMediaConsumoCli | number:'1.1-1' }}%
              </p>
              <p class="text-xs text-slate-500 mt-1">(Últimos 3m)</p>
            </div>
          </div>
        </div>

        <!-- GRID SECUNDÁRIO -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Simulação de Economia -->
          <div class="bg-gradient-to-br from-emerald-900/30 to-slate-900 border border-emerald-700/30 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
            <p class="text-sm text-emerald-400 uppercase tracking-wider font-semibold mb-6">💡 Simulação de Economia</p>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-slate-300 mb-2 font-semibold">Cliente</label>
                <select #clienteSelect class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" (change)="onClienteChange(clienteSelect.value)">
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
                <div class="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg">
                  <p class="text-xs text-emerald-300 uppercase tracking-wider font-semibold">Resultado</p>
                  <p class="text-2xl font-bold text-emerald-400 mt-2">{{ resultado()?.economiaPercentual | number:'1.1-1' }}%</p>
                  <p class="text-sm text-emerald-300 mt-3">
                    💰 R$ {{ resultado()?.economiaValor | number:'1.2-2' }}/mês
                  </p>
                </div>
              }

              @if (erroMessage()) {
                <div class="p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
                  <p class="text-xs text-red-300 uppercase tracking-wider font-semibold">Erro</p>
                  <p class="text-sm text-red-300 mt-2">{{ erroMessage() }}</p>
                </div>
              }
            </div>
          </div>

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
                <li *ngFor="let c of ultimosClientes; trackBy: trackById" class="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg hover:border-sky-500/40 transition-all hover:bg-slate-800/50">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-slate-100 font-semibold">{{ c.nome }}</p>
                      <p class="text-xs text-slate-500 mt-1">📍 {{ c.regiao }}</p>
                    </div>
                    <span class="text-lg font-bold text-cyan-400">{{ c.consumoMedio | number:'1.0-0' }} MWh</span>
                  </div>
                </li>
              </ul>
              <ng-template #semClientes>
                <p class="text-sm text-slate-500 text-center py-8">📭 Cadastre clientes para ver histórico.</p>
              </ng-template>
            }
          </div>
        </div>

        <!-- Ranking de Clientes com Análise -->
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all">
          <div class="mb-6">
            <p class="text-sm text-slate-400 uppercase tracking-wider font-semibold">🏆 Ranking de Clientes</p>
            <p class="text-xs text-slate-500 mt-1">Com análise de consumo real vs estimado e tendências</p>
          </div>

          @if (dashboard()?.topClientesEconomia?.length) {
            <ul class="space-y-3">
              @for (cliente of dashboard()?.topClientesEconomia ?? []; track cliente?.clienteId; let i = $index) {
                <li class="flex flex-col md:flex-row md:items-start md:justify-between p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg hover:border-emerald-500/40 transition-all">
                  <div class="flex-1">
                    <p class="text-slate-100 font-semibold">#{{ i + 1 }} {{ cliente.nomeCliente }}</p>
                    <p class="text-xs text-slate-500 mt-1">Fornecedor: {{ cliente.fornecedor }}</p>
                    <div class="mt-3 space-y-2">
                      <p class="text-sm text-slate-300">
                        📊 Consumo: <span class="font-bold text-cyan-400">{{ cliente.consumoMedioMensal | number:'1.0-0' }} MWh</span> 
                        / Estimado: <span class="font-bold text-slate-400">{{ cliente.consumoEstimado | number:'1.0-0' }} MWh</span>
                      </p>
                      <div class="flex flex-col md:flex-row gap-2 md:gap-4 text-xs">
                        <span [class]="cliente.variacaoPercentual <= 0 ? 'text-emerald-400' : 'text-red-400'" class="font-semibold">
                          📈 Variação: {{ cliente.variacaoPercentual | number:'1.1-1' }}%
                        </span>
                        <span [class]="cliente.tendenciaPercentual <= 0 ? 'text-emerald-400' : 'text-amber-400'" class="font-semibold">
                          📉 Tendência: {{ cliente.tendenciaPercentual | number:'1.1-1' }}%
                        </span>
                      </div>
                    </div>
                    @if (getAlertaConsumo(cliente.variacaoPercentual)) {
                      <p class="text-xs font-semibold mt-2 text-red-400">
                        {{ getAlertaConsumo(cliente.variacaoPercentual) }}
                      </p>
                    }
                  </div>
                  <div class="text-right mt-3 md:mt-0 md:ml-4">
                    <span class="text-lg font-bold text-amber-400 block">R$ {{ cliente.economiaEstimada | number:'1.0-0' }}</span>
                    <span class="text-xs text-slate-400 block mt-1">economia mensal</span>
                  </div>
                </li>
              }
            </ul>
          } @else {
            <p class="text-sm text-slate-500 text-center py-8">Nenhum cliente com contrato ativo para ranking.</p>
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
  erroDashboard = signal<string>('');
  ultimosClientes: ClienteDetail[] = [];

  constructor() {
    this.loadDashboard();
    this.loadClientes();
  }

  getAlertaConsumo(variacao: number): null | string {
    if (variacao > 50) return '⚠️ Consumo muito acima do estimado';
    if (variacao < -30) return '💡 Consumo abaixo do esperado';
    return null;
  }

  trackById(index: number, item: ClienteDetail) {
    return item?.id ?? index;
  }

  loadDashboard() {
    this.carregandoDashboard.set(true);
    this.erroDashboard.set('');
    this.apiService.getDashboard().subscribe({
      next: (data: Dashboard) => {
        this.dashboard.set(data);
        this.carregandoDashboard.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar dashboard:', err);
        this.erroDashboard.set('Erro ao carregar dados. Verifique backend em localhost:5243.');
        this.carregandoDashboard.set(false);
      }
    });
  }

  loadClientes() {
    this.carregandoClientes.set(true);
    this.apiService.getClientesWithDetails().subscribe({
      next: (data: ClienteDetail[]) => {
        const sorted = data.sort((a, b) => b.id - a.id);
        this.clientes.set(sorted);
        this.ultimosClientes = sorted
          .filter(c => c && c.id) // 🔥 proteção
          .slice(0, 5);
        this.clientesComContratoAtivo = sorted.filter(c => c.contratoAtivo != null);
        this.carregandoClientes.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar clientes:', err);
        this.carregandoClientes.set(false);
      }
    });
  }

  onClienteChange(value: string) {
    this.selectedClienteId.set(parseInt(value) || null);
  }

  calcular() {
    const id = this.selectedClienteId();
    const preco = parseFloat(this.precoAtual);
    if (id && !isNaN(preco) && preco > 0) {
      this.erroMessage.set('');
      this.apiService.calcularEconomia(id, preco).subscribe({
        next: (data: EconomiaSimulacao) => this.resultado.set(data),
        error: (err: any) => {
          console.error('Erro simulação:', err);
          this.erroMessage.set('Erro ao calcular. Verifique dados do cliente.');
        }
      });
    } else {
      this.erroMessage.set('Selecione cliente e preço válido.');
    }
  }
}
