
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
    <div class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          👥 Clientes
        </h1>
        <button routerLink="/clientes/novo" class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 shadow-xl transition-all">
          + Novo Cliente
        </button>
      </div>

      @if (carregando) {
        <div class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      } @else {
        @if (clientes().length === 0) {
          <div class="text-center py-20">
            <div class="w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              👥
            </div>
            <h3 class="text-2xl font-bold text-gray-600 mb-4">Nenhum cliente cadastrado</h3>
            <p class="text-gray-500 mb-8">Comece adicionando seu primeiro cliente.</p>
            <button routerLink="/clientes/novo" class="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 shadow-xl transition-all">
              Adicionar Primeiro Cliente
            </button>
          </div>
        } @else {
          <!-- Tabela -->
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Nome</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">CNPJ</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Consumo Médio</th>
                    <th class="px-8 py-6 text-left text-lg font-bold text-gray-800">Região</th>
                    <th class="px-8 py-6 text-right text-lg font-bold text-gray-800">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cliente of clientes(); track cliente.id) {
                    <tr class="border-t border-gray-100 hover:bg-gray-50 transition-all">
                      <td class="px-8 py-6 font-semibold text-gray-900">{{ cliente.nome }}</td>
                      <td class="px-8 py-6 text-gray-700">{{ cliente.cnpj }}</td>
                      <td class="px-8 py-6 font-bold text-orange-600">{{ cliente.consumoMedio | number:'1.0-0' }} MWh</td>
                      <td class="px-8 py-6">
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {{ cliente.regiao }}
                        </span>
                      </td>
                      <td class="px-8 py-6 text-right">
                        <div class="flex gap-2 justify-end">
                          <button (click)="editar(cliente.id)" class="text-blue-600 hover:text-blue-500 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-all">
                            Editar
                          </button>
                          <button (click)="deletar(cliente.id)" class="text-red-600 hover:text-red-500 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
                            Deletar
                          </button>
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

