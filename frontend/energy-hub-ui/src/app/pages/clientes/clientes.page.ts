
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cliente, CreateCliente, UpdateCliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-6 px-4">
      <div class="max-w-6xl mx-auto space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight">Clientes</h2>
            <p class="text-sm text-slate-400">Gerencie seus clientes no mercado livre</p>
          </div>
          <button routerLink="/clientes/novo" class="inline-flex items-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white">
            + Novo
          </button>
        </div>

        @if (carregando) {
          <div class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
          </div>
        } @else {
          @if (clientes().length === 0) {
            <div class="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
              <p class="text-sm text-slate-400">Nenhum cliente cadastrado</p>
              <button routerLink="/clientes/novo" class="mt-3 inline-flex items-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white">
                Adicionar Primeiro
              </button>
            </div>
          } @else {
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead class="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Nome</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">CNPJ</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Consumo</th>
                      <th class="px-4 py-3 text-left font-semibold text-slate-200">Região</th>
                      <th class="px-4 py-3 text-right font-semibold text-slate-200">Ações</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800">
                    @for (cliente of clientes(); track cliente.id) {
                      <tr class="hover:bg-slate-800/50 transition-all">
                        <td class="px-4 py-3 text-slate-100 font-medium">{{ cliente.nome }}</td>
                        <td class="px-4 py-3 text-slate-400">{{ cliente.cnpj }}</td>
                        <td class="px-4 py-3 font-semibold text-amber-400">{{ cliente.consumoMedio | number:'1.0-0' }} MWh</td>
                        <td class="px-4 py-3 text-slate-400">
                          <span class="px-2 py-1 text-[11px] bg-blue-900/40 text-blue-300 rounded">{{ cliente.regiao }}</span>
                        </td>
                        <td class="px-4 py-3 text-right space-x-1">
                          <button (click)="editar(cliente.id)" class="text-sky-400 hover:text-sky-300 text-[11px] font-medium">Editar</button>
                          <button (click)="deletar(cliente.id)" class="text-red-400 hover:text-red-300 text-[11px] font-medium">Deletar</button>
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
export class ClientesPage {
  private apiService = inject(ApiService);
  
  clientes = signal<Cliente[]>([]);
  carregando = true;

  constructor() {
    this.loadClientes();
  }

  loadClientes() {
    this.apiService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes.set(data);
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro:', err);
        this.carregando = false;
      }
    });
  }

  editar(id: number) {
    // Navigate to edit form
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

