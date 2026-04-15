
import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cliente, CreateCliente, UpdateCliente } from '../../models/cliente.model';
import { ClienteDetail } from '../../models/cliente-detail.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 font-sans">
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-display text-display-md font-bold text-slate-100">Clientes</h1>
            <p class="text-slate-400 font-light mt-2">Gerencie seus clientes no mercado livre de energia</p>
          </div>
          <button routerLink="/clientes/novo" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105">
            + Novo Cliente
          </button>
        </div>

        @if (carregando()) {
          <div class="flex justify-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/30 border-t-emerald-500"></div>
          </div>
        } @else {
          @if (clientes().length === 0) {
            <div class="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900 border-2 border-dashed border-slate-700 rounded-2xl">
              <p class="text-lg text-slate-400 font-light">📭 Nenhum cliente cadastrado</p>
              <button routerLink="/clientes/novo" class="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/30">
                Adicionar Primeiro Cliente
              </button>
            </div>
          } @else {
            <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all">
              <div class="overflow-x-auto">
                <table class="w-full text-sm">

                  <thead class="bg-slate-950/80 border-b border-slate-700">
  <tr>
    <th class="px-6 py-4  text-left text-xs text-slate-400">ID</th>
    <th class="px-6 py-4 text-left text-xs text-slate-400">Nome</th>
    <th class="px-6 py-4 text-left text-xs text-slate-400">CNPJ</th>
    <th class="px-6 py-4 text-left text-xs text-slate-400">Consumo</th>
    <th class="px-6 py-4 text-left text-xs text-slate-400">Região</th>
    <th class="px-6 py-4 text-left text-xs text-slate-400">Contrato</th>
    <th class="px-6 py-4 text-left text-xs text-slate-400">Economia</th>
    <th class="px-6 py-4 text-right text-xs text-slate-400">Ações</th>
  </tr>
</thead>

<tbody class="divide-y divide-slate-700">
  @for (cliente of clientes(); track cliente.id) {
    <tr class="hover:bg-slate-800/40 transition-all duration-200">

      <!-- ID -->
      <td class="px-6 py-5 text-slate-500 font-mono text-xs">
        #{{ cliente.id }}
      </td>

      <!-- Nome -->
      <td class="px-6 py-5 text-slate-100 font-semibold">
        {{ cliente.nome }}
      </td>

      <!-- CNPJ -->
      <td class="px-6 py-5 text-slate-400 font-mono text-xs">
        {{ cliente.cnpj }}
      </td>

      <!-- Consumo -->
      <td class="px-6 py-5">
        <span class="text-base font-semibold text-amber-400">
          {{ cliente.consumoMedio | number:'1.0-0' }} MWh
        </span>
      </td>

      <!-- Região -->
      <td class="px-6 py-5">
        <span class="px-3 py-1 text-xs bg-blue-500/10 text-blue-300 rounded-full">
          {{ cliente.regiao }}
        </span>
      </td>

      <!-- Status -->
      <td class="px-6 py-5">
        <span
          class="px-3 py-1 text-xs font-medium rounded-full"
[ngClass]="cliente.statusContrato?.includes('Ativo') ?? false\n            ? 'bg-emerald-500/10 text-emerald-400'\n            : 'bg-red-500/10 text-red-400'">
          {{ cliente.statusContrato }}
        </span>
      </td>

      <!-- Economia -->
      <td class="px-6 py-5">
        <span
          class="text-lg font-bold"
          [ngClass]="cliente.economiaEstimada >= 0
            ? 'text-emerald-400'
            : 'text-red-400'">
          R$ {{ cliente.economiaEstimada | number:'1.0-0' }}
        </span>
      </td>

      <!-- Ações -->
      <td class="px-6 py-5 text-right">
        <div class="flex justify-end gap-3">

          <button (click)="editar(cliente.id)"
            class="w-9 h-9 flex items-center justify-center bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 rounded-lg transition">
            ✏️
          </button>

          <button (click)="deletar(cliente.id)"
            class="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition">
            🗑️
          </button>

          <a [routerLink]="['/contratos/novo']"
            class="w-9 h-9 flex items-center justify-center bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition">
            ➕
          </a>

        </div>
      </td>

    </tr>
  }
</tbody>
                </table>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class ClientesPage implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  clientes = signal<ClienteDetail[]>([]);
  carregando = signal(true);


  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {

    this.carregando.set(true);
    this.clientes.set([]);

    this.apiService.getClientesWithDetails().subscribe({
      next: (data: ClienteDetail[]) => {
        this.clientes.set(data);
        this.carregando.set(false);
      },
      error: (err: any) => {
        console.error('Erro:', err);
        this.carregando.set(false);
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/clientes/editar', id]);
  }

  deletar(id: number) {
    if (confirm('Confirmar exclusão?')) {
      this.apiService.deleteCliente(id).subscribe({
        next: () => this.loadClientes(),
        error: (err: any) => console.error('Erro ao deletar:', err)
      });
    }
  }
}

