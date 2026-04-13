
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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 class="text-xl font-semibold tracking-tight text-slate-100 mb-1">
          {{ modo === 'novo' ? '➕ Novo Cliente' : '✏️ Editar Cliente' }}
        </h1>
        <p class="text-xs text-slate-400 mb-4">{{ modo === 'novo' ? 'Preencha os dados do cliente' : 'Atualize os dados' }}</p>

        <form (ngSubmit)="salvar()" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Nome Completo *</label>
            <input [(ngModel)]="form.nome" name="nome" required type="text" 
                   class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder:text-slate-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">CNPJ *</label>
            <input [(ngModel)]="form.cnpj" name="cnpj" required type="text" maxlength="18" 
                   class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder:text-slate-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Consumo Médio (MWh) *</label>
            <input [(ngModel)]="form.consumoMedio" name="consumoMedio" required type="number" step="0.01" min="0" 
                   class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder:text-slate-500">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Região *</label>
            <select [(ngModel)]="form.regiao" name="regiao" required class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-sky-500 text-slate-100">
              <option value="">Selecione a região</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Sul">Sul</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Norte">Norte</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
            </select>
          </div>

          <div class="flex gap-2 pt-3">
            <button type="submit" class="flex-1 inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-medium text-white transition-all">
              {{ modo === 'novo' ? '💾 Criar' : '✏️ Atualizar' }}
            </button>
            <a routerLink="/clientes" class="flex-1 inline-flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition-all border border-slate-700">
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

