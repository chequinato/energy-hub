
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cliente, CreateCliente, UpdateCliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div class="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-4">
            {{ modo === 'novo' ? '👥 Novo Cliente' : '✏️ Editar Cliente' }}
          </h1>
          <p class="text-gray-600">{{ modo === 'novo' ? 'Preencha os dados do cliente' : 'Atualize os dados do cliente' }}</p>
        </div>

        <form (ngSubmit)="salvar()" class="space-y-8">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">Nome Completo *</label>
            <input [(ngModel)]="form.nome" name="nome" required type="text" 
                   class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all text-lg"
                   placeholder="Nome da empresa ou pessoa">
          </div>

          <!-- CNPJ -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">CNPJ *</label>
            <input [(ngModel)]="form.cnpj" name="cnpj" required type="text" maxlength="18" 
                   class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all text-lg"
                   placeholder="12.345.678/0001-99">
          </div>

          <!-- Consumo Médio -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">Consumo Médio Mensal (MWh) *</label>
            <input [(ngModel)]="form.consumoMedio" name="consumoMedio" required type="number" step="0.01" min="0" 
                   class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all text-lg"
                   placeholder="500">
          </div>

          <!-- Região -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">Região *</label>
            <select [(ngModel)]="form.regiao" name="regiao" required class="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all text-lg">
              <option value="">Selecione a região</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Norte">Norte</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
            </select>
          </div>

          <!-- Botões -->
          <div class="flex gap-4 pt-8">
            <button type="submit" class="flex-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:scale-105 shadow-2xl transition-all">
              {{ modo === 'novo' ? '💾 Criar Cliente' : '✏️ Atualizar' }}
            </button>
            <a routerLink="/clientes" class="flex-1 bg-gray-100 text-gray-700 py-4 px-8 rounded-2xl font-bold text-xl text-center hover:bg-gray-200 transition-all shadow-lg">
              ← Voltar
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClienteFormPage implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  modo = 'novo';
  clienteId = 0;
  form: CreateCliente = { nome: '', cnpj: '', consumoMedio: 0, regiao: '' };

  ngOnInit() {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clienteId) {
      this.modo = 'editar';
      this.apiService.getCliente(this.clienteId).subscribe({
        next: (cliente: Cliente) => {
          this.form = {
            nome: cliente.nome,
            cnpj: cliente.cnpj,
            consumoMedio: cliente.consumoMedio,
            regiao: cliente.regiao
          };
        },
        error: () => this.router.navigate(['/clientes'])
      });
    }
  }

  salvar() {
    if (this.modo === 'novo') {
      this.apiService.createCliente(this.form).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err: any) => console.error('Erro:', err)
      });
    } else {
      this.apiService.updateCliente(this.clienteId, this.form as UpdateCliente).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err: any) => console.error('Erro:', err)
      });
    }
  }
}

