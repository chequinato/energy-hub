import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Consumo, CreateConsumo, UpdateConsumo } from '../../models/consumo.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-consumos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 font-sans">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-display text-display-md font-bold text-slate-100">📊 Histórico de Consumo</h1>
            <p class="text-slate-400 font-light mt-2">Gerenciamento de consumo mensal por cliente</p>
          </div>
          <button (click)="abrirFormulario()" class="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-sky-500/30 transform hover:scale-105">
            + Novo Consumo
          </button>
        </div>

        <!-- Formulário de Novo Consumo -->
        @if (mostrarFormulario()) {
          <div class="bg-gradient-to-br from-sky-900/30 to-slate-900 border border-sky-700/30 rounded-2xl p-6">
            <div class="mb-4">
              <h2 class="text-lg font-semibold text-sky-400">Registrar Novo Consumo</h2>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-slate-300 mb-2 font-semibold">Cliente</label>
                  <select [(ngModel)]="novoConsumo.clienteId" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
                    <option value="">Selecione um cliente</option>
                    @for (cliente of clientes(); track cliente.id) {
                      <option [value]="cliente.id">{{ cliente.nome }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-xs text-slate-300 mb-2 font-semibold">Mês (YYYY-MM)</label>
                  <input [(ngModel)]="novoConsumo.mes" type="text" placeholder="2025-04"
                         class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all placeholder:text-slate-500">
                </div>

                <div>
                  <label class="block text-xs text-slate-300 mb-2 font-semibold">Consumo (MWh)</label>
                  <input [(ngModel)]="novoConsumo.consumoMwh" type="number" step="0.01" placeholder="0.00"
                         class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all placeholder:text-slate-500">
                </div>
              </div>

              <div class="flex gap-3 justify-end">
                <button (click)="cancelar()" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all">
                  Cancelar
                </button>
                <button (click)="salvar()" class="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/30">
                  Salvar Consumo
                </button>
              </div>

              @if (erroMessage()) {
                <div class="p-4 bg-red-500/10 border border-red-500/40 rounded-lg">
                  <p class="text-sm text-red-300">❌ {{ erroMessage() }}</p>
                </div>
              }

              @if (successMessage()) {
                <div class="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg">
                  <p class="text-sm text-emerald-300">✅ {{ successMessage() }}</p>
                </div>
              }
            </div>
          </div>
        }

        <ng-container *ngIf="carregando(); else lista">
          <div class="flex justify-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-sky-500/30 border-t-sky-500"></div>
          </div>
        </ng-container>

        <ng-template #lista>
          <!-- Filtro por Cliente -->
          <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <label class="block text-xs text-slate-300 mb-2 font-semibold">Filtrar por Cliente</label>
            <select [(ngModel)]="clienteFiltro" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all">
              <option value="">Todos os clientes</option>
              @for (cliente of clientes(); track cliente.id) {
                <option [value]="cliente.id | number">{{ cliente.nome }}</option>
              }
            </select>
          </div>

          <ng-container *ngIf="consumosFiltrados().length === 0; else tabela">
            <div class="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900 border-2 border-dashed border-slate-700 rounded-2xl">
              <p class="text-lg text-slate-400 font-light">📭 Nenhum consumo cadastrado</p>
              <button (click)="abrirFormulario()" class="mt-6 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-sky-500/30">
                Adicionar Primeiro Consumo
              </button>
            </div>
          </ng-container>

          <ng-template #tabela>
            <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-950/80 border-b border-slate-700">
                    <tr>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Cliente</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Mês</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Consumo</th>
                      <th class="px-6 py-4 text-left font-semibold text-slate-300 uppercase tracking-wider text-xs">Ações</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-700">
                    @for (consumo of consumosFiltrados(); track consumo.id) {
                      <tr class="hover:bg-slate-700/40 transition-all hover:border-l-4 hover:border-l-sky-500">
                        <td class="px-6 py-4 text-slate-100 font-medium">
                          {{ getNomeCliente(consumo.clienteId) }}
                        </td>
                        <td class="px-6 py-4 text-slate-400">
                          <span class="px-2.5 py-1 text-xs font-mono bg-slate-700/40 text-slate-300 rounded">{{ consumo.mes }}</span>
                        </td>
                        <td class="px-6 py-4">
                          <span class="font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">{{ consumo.consumoMwh | number:'1.0-2' }} MWh</span>
                        </td>
                        <td class="px-6 py-4 text-sm flex gap-2">
                          <button (click)="editar(consumo)" class="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded transition-all text-xs font-semibold">
                            ✏️ Editar
                          </button>
                          <button (click)="deletar(consumo.id)" class="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded transition-all text-xs font-semibold">
                            🗑️ Deletar
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </ng-template>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class ConsumoPage implements OnInit {
  private apiService = inject(ApiService);
  
  consumos = signal<Consumo[]>([]);
  clientes = signal<Cliente[]>([]);
  carregando = signal(true);
  mostrarFormulario = signal(false);
  clienteFiltro = '';
  erroMessage = signal<string>('');
  successMessage = signal<string>('');
  
  novoConsumo: CreateConsumo = {
    clienteId: 0,
    mes: '',
    consumoMwh: 0
  };

  consumoFiltrado: UpdateConsumo | null = null;
  consumoFiltradoId: number | null = null;

  ngOnInit() {
    this.loadConsumos();
    this.loadClientes();
  }

  loadConsumos() {
    this.carregando.set(true);
    this.apiService.getConsumos().subscribe({
      next: (data: Consumo[]) => {
        this.consumos.set(data.sort((a, b) => b.id - a.id));
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      }
    });
  }

  loadClientes() {
    this.apiService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes.set(data);
      },
      error: () => {}
    });
  }

  consumosFiltrados() {
    const filtro = this.clienteFiltro ? parseInt(this.clienteFiltro) : null;
    if (!filtro) {
      return this.consumos();
    }
    return this.consumos().filter(c => c.clienteId === filtro);
  }

  getNomeCliente(clienteId: number): string {
    return this.clientes().find(c => c.id === clienteId)?.nome || `Cliente #${clienteId}`;
  }

  abrirFormulario() {
    this.mostrarFormulario.set(true);
    this.erroMessage.set('');
    this.successMessage.set('');
    this.novoConsumo = { clienteId: 0, mes: '', consumoMwh: 0 };
  }

  cancelar() {
    this.mostrarFormulario.set(false);
    this.consumoFiltrado = null;
    this.consumoFiltradoId = null;
    this.erroMessage.set('');
    this.successMessage.set('');
  }

  salvar() {
    this.erroMessage.set('');
    this.successMessage.set('');

    if (!this.novoConsumo.clienteId || !this.novoConsumo.mes || this.novoConsumo.consumoMwh <= 0) {
      this.erroMessage.set('Preencha todos os campos corretamente');
      return;
    }

    if (this.consumoFiltradoId) {
      this.apiService.updateConsumo(this.consumoFiltradoId, {
        mes: this.novoConsumo.mes,
        consumoMwh: this.novoConsumo.consumoMwh
      }).subscribe({
        next: () => {
          this.successMessage.set('Consumo atualizado com sucesso!');
          setTimeout(() => {
            this.cancelar();
            this.loadConsumos();
          }, 1500);
        },
        error: (err) => {
          this.erroMessage.set(err.error?.message || 'Erro ao atualizar consumo');
        }
      });
    } else {
      this.apiService.createConsumo(this.novoConsumo).subscribe({
        next: () => {
          this.successMessage.set('Consumo registrado com sucesso!');
          setTimeout(() => {
            this.cancelar();
            this.loadConsumos();
          }, 1500);
        },
        error: (err) => {
          this.erroMessage.set(err.error?.message || 'Erro ao registrar consumo');
        }
      });
    }
  }

  editar(consumo: Consumo) {
    this.mostrarFormulario.set(true);
    this.consumoFiltradoId = consumo.id;
    this.novoConsumo = {
      clienteId: consumo.clienteId,
      mes: consumo.mes,
      consumoMwh: consumo.consumoMwh
    };
    this.consumoFiltrado = {
      mes: consumo.mes,
      consumoMwh: consumo.consumoMwh
    };
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar este registro de consumo?')) {
      this.apiService.deleteConsumo(id).subscribe({
        next: () => {
          this.loadConsumos();
        },
        error: () => {
          alert('Erro ao deletar consumo');
        }
      });
    }
  }
}
