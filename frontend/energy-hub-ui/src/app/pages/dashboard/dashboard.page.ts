
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
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-6 px-4">
      <div class="max-w-6xl mx-auto space-y-4">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight">Dashboard de Energia</h2>
          <p class="text-sm text-slate-400">Resumo geral de seus clientes e contratos</p>
        </div>

        <div class="grid gap-4 md:grid-cols-4">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p class="text-xs text-slate-400">Total Clientes</p>
            <p class="mt-2 text-2xl font-bold text-sky-400">{{ clientesCount }}</p>
            <p class="mt-1 text-[11px] text-sky-300">Cadastrados no sistema</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p class="text-xs text-slate-400">Contratos Ativos</p>
            <p class="mt-2 text-2xl font-bold text-emerald-400">{{ contratosCount }}</p>
            <p class="mt-1 text-[11px] text-emerald-300">Contratos vigentes</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p class="text-xs text-slate-400">Consumo Médio</p>
            <p class="mt-2 text-2xl font-bold text-amber-300">{{ consumoMedio | number:'1.0-0' }}</p>
            <p class="mt-1 text-[11px] text-amber-200">MWh/mês total</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p class="text-xs text-slate-400">Tarifa Média</p>
            <p class="mt-2 text-2xl font-bold text-orange-400">R$ {{ tarifaMedia | number:'1.2-2' }}</p>
            <p class="mt-1 text-[11px] text-orange-300">Por MWh</p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          <!-- Clientes Recentes -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-52">
            <p class="text-xs text-slate-400 mb-3">Clientes Recentes</p>
            @if (carregandoClientes()) {
              <div class="flex justify-center py-6">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500"></div>
              </div>
            } @else {
              <ul class="space-y-2 text-xs text-slate-300" *ngIf="ultimosClientes.length; else semClientes">
                <li *ngFor="let c of ultimosClientes" class="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <p class="text-slate-100 font-medium">{{ c.nome }}</p>
                    <p class="text-[11px] text-slate-500">{{ c.regiao }}</p>
                  </div>
                  <span class="text-amber-400 font-semibold text-sm">{{ c.consumoMedio | number:'1.0-0' }} MWh</span>
                </li>
              </ul>
              <ng-template #semClientes>
                <p class="text-[11px] text-slate-500">Cadastre clientes para ver o histórico.</p>
              </ng-template>
            }
          </div>

          <!-- Simulação -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-52">
            <p class="text-xs text-slate-400 mb-3">Simulação de Economia</p>
            <div class="space-y-2 text-xs">
              <select [(ngModel)]="selectedClienteId" class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:ring-2 focus:ring-sky-500">
                <option value="">Selecione cliente</option>
                @for (cliente of clientes(); track cliente.id) {
                  <option [value]="cliente.id">{{ cliente.nome }}</option>
                }
              </select>
              <input [(ngModel)]="precoAtual" type="number" step="0.01" placeholder="Preço (R$/MWh)"
                     class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500">
              <button (click)="calcular()" class="w-full bg-sky-600 hover:bg-sky-500 px-2 py-1.5 rounded-md font-medium text-white transition-all">
                Calcular
              </button>
              @if (resultado()) {
                <div class="p-2 bg-emerald-500/10 rounded-md border border-emerald-500/30">
                  <p class="text-emerald-400 font-semibold">{{ resultado()?.economiaPercentual | number:'1.1-1' }}% economia</p>
                  <p class="text-emerald-300 font-bold mt-1">R$ {{ resultado()?.economiaValor | number:'1.2-2' }}/mês</p>
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

