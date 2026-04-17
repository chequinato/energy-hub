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
    <div class="space-y-10">
        <!-- HEADER -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-display-md font-semibold tracking-[-0.03em] text-slate-50">Dashboard</h1>
            <p class="eh-muted mt-2 max-w-3xl">
              Visão geral com análise de consumo e economia (real vs estimado).
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="eh-badge eh-badge-neutral">Atualizado em tempo real</span>
          </div>
        </div>

        <!-- Error Message -->
        @if (erroDashboard()) {
          <div class="eh-card p-4 border-red-500/30 bg-red-500/5">
            <p class="text-sm text-red-200 font-semibold tracking-wide">Falha ao carregar</p>
            <p class="text-sm text-red-200/80 mt-1">{{ erroDashboard() }}</p>
          </div>
        }

        <!-- CARDS RESUMO -->
        <div class="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-5">
          @if (carregandoDashboard()) {
            @for (_ of [1,2,3,4,5]; track _) {
              <div class="eh-kpi p-6">
                <div class="flex items-center justify-between">
                  <div class="eh-skeleton-title w-32"></div>
                  <div class="eh-skeleton h-8 w-8 rounded-xl"></div>
                </div>
                <div class="mt-4 eh-skeleton h-9 w-24 rounded-xl"></div>
                <div class="mt-3 eh-skeleton-line w-28"></div>
              </div>
            }
          } @else {
            <div class="eh-kpi">
              <div class="flex items-center justify-between">
                <p class="eh-kpi-label">Total clientes</p>
                <span class="rounded-xl border border-slate-800/70 bg-slate-900/40 px-2.5 py-1 text-xs font-semibold text-slate-200">👥</span>
              </div>
              <p class="eh-kpi-value">{{ dashboard()?.totalClientes ?? 0 }}</p>
              <p class="text-xs text-slate-500 mt-2">Base de clientes</p>
            </div>

            <div class="eh-kpi">
              <div class="flex items-center justify-between">
                <p class="eh-kpi-label">Contratos ativos</p>
                <span class="rounded-xl border border-slate-800/70 bg-slate-900/40 px-2.5 py-1 text-xs font-semibold text-slate-200">📄</span>
              </div>
              <p class="eh-kpi-value">{{ dashboard()?.totalContratosAtivos ?? 0 }}</p>
              <p class="text-xs text-slate-500 mt-2">Carteira ativa</p>
            </div>

            <div class="eh-kpi">
              <div class="flex items-center justify-between">
                <p class="eh-kpi-label">Com contrato</p>
                <span class="rounded-xl border border-slate-800/70 bg-slate-900/40 px-2.5 py-1 text-xs font-semibold text-slate-200">🏷️</span>
              </div>
              <p class="eh-kpi-value">{{ dashboard()?.clientesComContratoAtivo ?? 0 }}</p>
              <p class="text-xs text-slate-500 mt-2">Clientes elegíveis</p>
            </div>

            <div class="eh-kpi ring-1 ring-amber-400/10 border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-slate-900/30">
              <div class="flex items-center justify-between">
                <p class="eh-kpi-label text-amber-200/80">Economia anual</p>
                <span class="rounded-xl border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200">💰</span>
              </div>
              <p class="mt-3 text-3xl md:text-4xl font-semibold text-amber-200">R$ {{ dashboard()?.economiaTotal | number:'1.0-0' }}</p>
              <p class="text-xs text-amber-200/60 mt-2">Destaque</p>
            </div>

            <div class="eh-kpi ring-1 ring-cyan-400/10 border-cyan-500/20 bg-gradient-to-b from-cyan-500/10 to-slate-900/30">
              <div class="flex items-center justify-between">
                <p class="eh-kpi-label text-cyan-200/80">Consumo médio</p>
                <span class="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">📊</span>
              </div>
              <p class="mt-3 text-3xl md:text-4xl font-semibold text-cyan-200">{{ dashboard()?.consumoMedioGeral | number:'1.0-0' }} <span class="text-base font-semibold text-cyan-200/70">MWh</span></p>
              <p class="text-xs text-cyan-200/60 mt-2">Destaque</p>
            </div>
          }
        </div>

        <!-- ANÁLISE GERAL DE CONSUMO -->
        <div class="eh-card eh-card-hover p-6">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div>
                <p class="eh-section-title font-mono">Análise geral</p>
              <p class="eh-muted text-sm mt-1">Real vs estimado e tendência média.</p>
            </div>
            <span class="eh-badge eh-badge-neutral">Consumo</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-5 ring-1 ring-white/5">
              <p class="text-xs text-slate-400 font-semibold tracking-wide">Total registrado</p>
              <p class="mt-3 text-2xl font-semibold text-slate-50">{{ dashboard()?.consumoTotalRegistrado | number:'1.0-0' }} <span class="text-sm text-slate-400 font-semibold">MWh</span></p>
            </div>

            <div class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-5 ring-1 ring-white/5">
              <p class="text-xs text-slate-400 font-semibold tracking-wide">Consumo médio</p>
              <p class="mt-3 text-2xl font-semibold text-slate-50">{{ dashboard()?.consumoMedioGeral | number:'1.0-0' }} <span class="text-sm text-slate-400 font-semibold">MWh</span></p>
            </div>

            <div class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-5 ring-1 ring-white/5">
              <div class="flex items-center justify-between">
                <p class="text-xs text-slate-400 font-semibold tracking-wide">Variação média</p>
                <span class="eh-badge" [ngClass]="(dashboard()?.variacaoMediaConsumoCli ?? 0) > 20 ? 'eh-badge-danger' : ((dashboard()?.variacaoMediaConsumoCli ?? 0) > 0 ? 'eh-badge-warning' : 'eh-badge-success')">
                  {{ (dashboard()?.variacaoMediaConsumoCli ?? 0) > 20 ? 'Alto consumo' : ((dashboard()?.variacaoMediaConsumoCli ?? 0) > 0 ? 'Normal' : 'Eficiente') }}
                </span>
              </div>
              <p class="mt-3 text-2xl font-semibold" [class]="(dashboard()?.variacaoMediaConsumoCli ?? 0) <= 0 ? 'text-emerald-300' : 'text-red-300'">
                {{ (dashboard()?.variacaoMediaConsumoCli ?? 0) <= 0 ? '▲' : '▼' }}
                {{ dashboard()?.variacaoMediaConsumoCli | number:'1.1-1' }}%
              </p>
              <p class="text-xs text-slate-500 mt-1">Real vs estimado</p>
            </div>

            <div class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-5 ring-1 ring-white/5">
              <p class="text-xs text-slate-400 font-semibold tracking-wide">Tendência geral</p>
              <p class="mt-3 text-2xl font-semibold" [class]="(dashboard()?.tendenciaMediaConsumoCli ?? 0) <= 0 ? 'text-emerald-300' : 'text-amber-300'">
                {{ (dashboard()?.tendenciaMediaConsumoCli ?? 0) <= 0 ? '▲' : '▼' }}
                {{ dashboard()?.tendenciaMediaConsumoCli | number:'1.1-1' }}%
              </p>
              <p class="text-xs text-slate-500 mt-1">Últimos 3 meses</p>
            </div>
          </div>
        </div>

        <!-- GRID SECUNDÁRIO -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Simulação de Economia -->
          <div class="eh-card eh-card-hover p-6">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <p class="eh-section-title">Simulação</p>
                <p class="eh-muted text-sm mt-1">Compare economia potencial por cliente.</p>
              </div>
              <span class="eh-badge eh-badge-success">Economia</span>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-xs text-slate-300 mb-2 font-semibold tracking-wide">Cliente</label>
                <select #clienteSelect class="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800/70 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder:text-slate-500" (change)="onClienteChange(clienteSelect.value)">
                  <option value="">Selecione um cliente</option>
                  @for (cliente of clientesComContratoAtivo(); track cliente.id) {
                    <option [value]="cliente.id">{{ cliente.nome }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-xs text-slate-300 mb-2 font-semibold tracking-wide">Preço (R$/MWh)</label>
                <input [(ngModel)]="precoAtual" type="number" step="0.01" placeholder="0.00"
                       class="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800/70 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-500">
              </div>

              <button (click)="calcular()" class="w-full rounded-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-2.5 transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(16,185,129,0.55)] transform hover:scale-[1.02]">
                Calcular economia
              </button>

              @if (resultado()) {
                <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 ring-1 ring-emerald-400/10">
                  <p class="text-xs uppercase tracking-[0.16em] font-semibold text-emerald-200/80">Resultado</p>
                  <div class="mt-3 flex items-end justify-between gap-4">
                    <p class="text-3xl font-semibold text-emerald-200">{{ resultado()?.economiaPercentual | number:'1.1-1' }}%</p>
                    <p class="text-sm text-emerald-200/80 font-semibold">R$ {{ resultado()?.economiaValor | number:'1.2-2' }}/mês</p>
                  </div>
                </div>
              }

              @if (erroMessage()) {
                <div class="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 ring-1 ring-red-400/10">
                  <p class="text-xs uppercase tracking-[0.16em] font-semibold text-red-200/90">Atenção</p>
                  <p class="text-sm text-red-200/80 mt-2">{{ erroMessage() }}</p>
                </div>
              }
            </div>
          </div>

          <!-- Clientes Recentes -->
          <div class="eh-card eh-card-hover p-6">
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <p class="eh-section-title">Clientes recentes</p>
                <p class="eh-muted text-sm mt-1">Últimos cadastros com consumo médio.</p>
              </div>
              <span class="eh-badge eh-badge-neutral">Clientes</span>
            </div>
            @if (carregandoClientes()) {
              <div class="space-y-3">
                @for (_ of [1,2,3,4,5]; track _) {
                  <div class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-4 ring-1 ring-white/5">
                    <div class="flex items-center justify-between gap-4">
                      <div class="space-y-2 flex-1">
                        <div class="eh-skeleton-line w-40"></div>
                        <div class="eh-skeleton-line w-24"></div>
                      </div>
                      <div class="eh-skeleton h-6 w-20 rounded-xl"></div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <ul class="space-y-3" *ngIf="ultimosClientes().length; else semClientes">
                <li *ngFor="let c of ultimosClientes(); trackBy: trackById" class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-4 ring-1 ring-white/5 hover:bg-slate-950/30 hover:border-slate-700/80 transition-all duration-300 hover:shadow-[0_18px_60px_-45px_rgba(34,211,238,0.18)] hover:-translate-y-0.5">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-slate-50 font-semibold tracking-wide">{{ c.nome }}</p>
                      <p class="text-xs text-slate-500 mt-1">Região: {{ c.regiao }}</p>
                    </div>
                    <span class="text-sm font-semibold text-cyan-200">{{ c.consumoMedio | number:'1.0-0' }} <span class="text-xs text-slate-400 font-semibold">MWh</span></span>
                  </div>
                </li>
              </ul>
              <ng-template #semClientes>
                <div class="rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/15 p-8 text-center ring-1 ring-white/5">
                  <p class="text-sm text-slate-300 font-semibold tracking-wide">Sem clientes ainda</p>
                  <p class="text-sm text-slate-500 mt-1">Cadastre clientes para ver histórico e tendências.</p>
                </div>
              </ng-template>
            }
          </div>
        </div>

        <!-- Ranking de Clientes com Análise -->
        <div class="eh-card eh-card-hover p-6">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div>
              <p class="eh-section-title">Ranking</p>
              <p class="eh-muted text-sm mt-1">Consumo real vs estimado, tendência e alertas.</p>
            </div>
            <span class="eh-badge eh-badge-neutral">Top clientes</span>
          </div>

          @if (dashboard()?.topClientesEconomia?.length) {
            <ul class="space-y-3">
              @for (cliente of dashboard()?.topClientesEconomia ?? []; track cliente?.clienteId; let i = $index) {
                <li class="rounded-2xl border border-slate-800/70 bg-slate-950/20 p-5 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_-50px_rgba(16,185,129,0.25)] hover:border-slate-700/80">
                  <div class="flex-1">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <p class="text-slate-50 font-semibold tracking-wide">#{{ i + 1 }} {{ cliente.nomeCliente }}</p>
                        <p class="text-xs text-slate-500 mt-1">Fornecedor: {{ cliente.fornecedor }}</p>
                      </div>

                      <div class="flex items-center gap-2">
                        <span class="eh-badge"
                          [ngClass]="cliente.variacaoPercentual > 20 ? 'eh-badge-danger' : (cliente.variacaoPercentual > 0 ? 'eh-badge-warning' : 'eh-badge-success')">
                          {{ cliente.variacaoPercentual > 20 ? 'Alto consumo' : (cliente.variacaoPercentual > 0 ? 'Normal' : 'Eficiente') }}
                        </span>
                      </div>
                    </div>

                    <div class="mt-4 space-y-3">
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p class="text-sm text-slate-300">
                          Consumo: <span class="font-semibold text-cyan-200">{{ cliente.consumoMedioMensal | number:'1.0-0' }} MWh</span>
                          <span class="text-slate-500">/ Estimado: </span>
                          <span class="font-semibold text-slate-300">{{ cliente.consumoEstimado | number:'1.0-0' }} MWh</span>
                        </p>
                        <p class="text-xs text-slate-500 font-semibold">
                          {{ ((cliente.consumoEstimado || 0) > 0 ? ((cliente.consumoMedioMensal / cliente.consumoEstimado) * 100) : 0) | number:'1.0-0' }}%
                        </p>
                      </div>

                      <div class="eh-progress">
                        <div
                          class="eh-progress-bar"
                          [style.width.%]="(cliente.consumoEstimado || 0) > 0 ? Math.min(160, (cliente.consumoMedioMensal / cliente.consumoEstimado) * 100) : 0"
                          [class]="cliente.variacaoPercentual > 20 ? 'bg-gradient-to-r from-red-400 to-rose-500' : (cliente.variacaoPercentual > 0 ? 'bg-gradient-to-r from-amber-300 to-orange-400' : 'bg-gradient-to-r from-emerald-300 to-teal-400')"
                        ></div>
                      </div>

                      <div class="flex flex-wrap gap-3 text-xs font-semibold">
                        <span [class]="cliente.variacaoPercentual <= 0 ? 'text-emerald-300' : 'text-red-300'">
                          {{ cliente.variacaoPercentual <= 0 ? '▲' : '▼' }} Variação: {{ cliente.variacaoPercentual | number:'1.1-1' }}%
                        </span>
                        <span [class]="cliente.tendenciaPercentual <= 0 ? 'text-emerald-300' : 'text-amber-300'">
                          {{ cliente.tendenciaPercentual <= 0 ? '▲' : '▼' }} Tendência: {{ cliente.tendenciaPercentual | number:'1.1-1' }}%
                        </span>
                      </div>
                    </div>

                    @if (getAlertaConsumo(cliente.variacaoPercentual)) {
                      <div class="mt-4 rounded-2xl border border-red-500/25 bg-red-500/5 p-4 ring-1 ring-red-400/10 animate-pulse">
                        <p class="text-xs uppercase tracking-[0.16em] font-semibold text-red-200/90">Alerta</p>
                        <p class="text-sm text-red-200/80 mt-1">{{ getAlertaConsumo(cliente.variacaoPercentual) }}</p>
                      </div>
                    }
                  </div>
                  <div class="mt-4 sm:mt-3">
                    <div class="flex items-end justify-between sm:justify-end gap-4">
                      <div class="text-right">
                        <span class="text-lg font-semibold text-amber-200 block">R$ {{ cliente.economiaEstimada | number:'1.0-0' }}</span>
                        <span class="text-xs text-slate-500 block mt-1">economia mensal</span>
                      </div>
                    </div>
                  </div>
                </li>
              }
            </ul>
          } @else {
            <p class="text-sm text-slate-500 text-center py-8">Nenhum cliente com contrato ativo para ranking.</p>
          }
        </div>

    </div>
  `,
  styles: []
})
export class DashboardPage {
  private apiService = inject(ApiService);
  protected readonly Math = Math;

  dashboard = signal<Dashboard | null>(null);
  clientes = signal<ClienteDetail[]>([]);
  clientesComContratoAtivo = signal<ClienteDetail[]>([]);
  carregandoClientes = signal(true);
  carregandoDashboard = signal(true);
  selectedClienteId = signal<number | null>(null);
  precoAtual = '';
  resultado = signal<EconomiaSimulacao | null>(null);
  erroMessage = signal<string>('');
  erroDashboard = signal<string>('');
  ultimosClientes = signal<ClienteDetail[]>([]);

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
      // Sempre cria um NOVO array (importante para signals!)
      const sorted = [...data].sort((a, b) => b.id - a.id);

      this.clientes.set(sorted);
      this.ultimosClientes.set(sorted.filter(c => c?.id).slice(0, 5));

      // FILTRO CORRIGIDO - usa statusContrato como principal
      const clientesAtivos = sorted.filter(c => {
        const status = (c.statusContrato || '').toLowerCase().trim();
        return status === 'ativo' || 
               status === 'active' || 
               status === 'em vigor' ||
               c.contratoAtivo != null;   // fallback
      });

      this.clientesComContratoAtivo.set(clientesAtivos);

      // DEBUG - abra o console (F12) e veja isso
      console.log('🔥 Total de clientes recebidos:', sorted.length);
      console.log('🔥 Clientes com contrato ativo (após filtro):', clientesAtivos.length);
      console.log('🔥 Exemplo do primeiro cliente:', sorted[0]);
      console.log('🔥 Status dos clientes:', sorted.map(c => ({ nome: c.nome, status: c.statusContrato })));

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
  const preco = parseFloat(this.precoAtual);   // ← mais seguro

  console.log(`🔍 Tentando calcular → Cliente ID: ${id} | Preço digitado: "${this.precoAtual}" → convertido: ${preco}`);

  if (!id) {
    this.erroMessage.set('❌ Selecione um cliente.');
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    this.erroMessage.set('❌ Informe um preço válido maior que zero (R$/MWh).');
    return;
  }

  this.erroMessage.set('');
  this.resultado.set(null);

  this.apiService.calcularEconomia(id, preco).subscribe({
    next: (data: EconomiaSimulacao) => {
      console.log('✅ Simulação retornada com sucesso:', data);
      this.resultado.set(data);
    },
    error: (err: any) => {
      console.error('❌ Erro na chamada da API:', err);

      if (err.status === 404) {
        this.erroMessage.set('❌ Endpoint não encontrado. Verifique a rota no backend (/api/clientes/simular-economia)');
      } else if (err.status === 400) {
        this.erroMessage.set('❌ Dados inválidos enviados para o backend.');
      } else {
        this.erroMessage.set(`❌ Erro ao calcular economia (${err.status || 'desconhecido'}). Veja o console.`);
      }
    }
  });
}
}
