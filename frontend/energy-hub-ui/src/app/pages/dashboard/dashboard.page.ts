
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
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <header class="max-w-6xl mx-auto mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-4">
          ⚡ EnergyHub Dashboard
        </h1>
        <nav class="flex gap-4 text-lg">
          <a routerLink="/clientes" class="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-lg">
            👥 Clientes
          </a>
          <a routerLink="/contratos" class="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white transition-all shadow-lg">
            📄 Contratos
          </a>
        </nav>
      </header>

      <main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Simulação Economy -->
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">💡 Simulação de Economia</h2>
          <div class="space-y-4">
            <select [(ngModel)]="selectedClienteId" class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500">
              <option value="">Selecione um cliente</option>
              @for (cliente of clientes(); track cliente.id) {
                <option [value]="cliente.id">{{ cliente.nome }} ({{ cliente.consumoMedio | number:'1.0-0' }} MWh/mês)</option>
              }
            </select>
            <input [(ngModel)]="precoAtual" type="number" step="0.01" placeholder="Preço atual (R$/MWh)" 
                   class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500">
            <button (click)="calcular()" class="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg">
              Calcular Economia
            </button>
            @if (resultado()) {
              <div class="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-l-4 border-green-500">
                <h3 class="font-bold text-xl mb-2">Economia: {{ resultado()?.economiaPercentual | number:'1.1-1' }}%</h3>
                <p class="text-3xl font-bold text-green-600 mb-1">R$ {{ resultado()?.economiaValor | number:'1.2-2' }}</p>
                <p class="text-gray-600">Mensal (baseado em {{ resultado()?.consumoMwh | number:'1.0-0' }} MWh)</p>
              </div>
            }
          </div>
        </div>

        <!-- Recent Clients -->
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">👥 Clientes Recentes</h2>
          @if (carregandoClientes()) {
            <div class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          } @else {
            @if (clientes().length === 0) {
              <div class="text-center py-12 text-gray-500">
                <p>Nenhum cliente cadastrado</p>
                <a routerLink="/clientes/novo" class="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600">
                  + Novo Cliente
                </a>
              </div>
            } @else {
              <div class="space-y-3 max-h-96 overflow-y-auto">
                @for (cliente of clientes(); track cliente.id) {
                  <div class="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                    <div class="flex justify-between items-center">
                      <div>
                        <h3 class="font-semibold text-gray-800">{{ cliente.nome }}</h3>
                        <p class="text-sm text-gray-500">{{ cliente.cnpj }} • {{ cliente.regiao }}</p>
                      </div>
                      <span class="text-2xl font-bold text-orange-600">{{ cliente.consumoMedio | number:'1.0-0' }} MWh</span>
                    </div>
                  </div>
                }
              </div>
            }
          }
        </div>
      </main>
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

  constructor() {
    this.loadClientes();
  }

  loadClientes() {
    this.apiService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes.set(data);
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
      this.apiService.calcularEconomia(id, parseFloat(this.precoAtual)).subscribe({
        next: (data: EconomiaSimulacao) => this.resultado.set(data),
        error: (err: any) => console.error('Erro simulação:', err)
      });
    }
  }
}

