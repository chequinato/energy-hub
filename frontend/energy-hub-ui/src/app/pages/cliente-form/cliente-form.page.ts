
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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 font-sans">
      <div class="max-w-md w-full">
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-8 hover:border-slate-600 transition-all">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="font-display text-2xl font-bold text-slate-100">
              {{ modo === 'novo' ? '➕ Novo Cliente' : '✏️ Editar Cliente' }}
            </h1>
            <p class="text-sm text-slate-400 font-light mt-2">
              {{ modo === 'novo' ? 'Preencha os dados do novo cliente' : 'Atualize as informações' }}
            </p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="salvar()" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2.5">Nome Completo *</label>
              <input [(ngModel)]="form.nome" name="nome" required type="text" placeholder="Nome da empresa"
                     class="w-full px-4 py-3 text-sm border border-slate-700 rounded-lg bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-600">
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2.5">CNPJ *</label>
              <input [(ngModel)]="form.cnpj" name="cnpj" required type="text" maxlength="18" placeholder="00.000.000/0000-00"
                     class="w-full px-4 py-3 text-sm border border-slate-700 rounded-lg bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-600 font-mono">
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2.5">Consumo Médio (MWh) *</label>
              <input [(ngModel)]="form.consumoMedio" name="consumoMedio" required type="number" step="0.01" min="0" placeholder="0.00"
                     class="w-full px-4 py-3 text-sm border border-slate-700 rounded-lg bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-600">
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2.5">Região *</label>
              <select [(ngModel)]="form.regiao" name="regiao" required 
                      class="w-full px-4 py-3 text-sm border border-slate-700 rounded-lg bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-100 hover:border-slate-600">
                <option value="" disabled>Selecione a região</option>
                <option value="Sudeste">Sudeste</option>
                <option value="Sul">Sul</option>
                <option value="Nordeste">Nordeste</option>
                <option value="Norte">Norte</option>
                <option value="Centro-Oeste">Centro-Oeste</option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-6">
              <button type="submit" class="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl shadow-sky-500/20 transform hover:scale-105">
                {{ modo === 'novo' ? '💾 Criar Cliente' : '✏️ Atualizar' }}
              </button>
              <a routerLink="/clientes" class="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-lg transition-all border border-slate-600 hover:border-slate-500 flex items-center justify-center">
                ← Voltar
              </a>
            </div>
          </form>
        </div>
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

