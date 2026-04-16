
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
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-display-md font-semibold tracking-[-0.03em] text-slate-50">Clientes</h1>
          <p class="eh-muted mt-2">Gerencie seus clientes no mercado livre de energia.</p>
        </div>
        <button
          routerLink="/clientes/novo"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-3 font-semibold transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(16,185,129,0.55)] hover:scale-[1.02]"
        >
          <span class="text-base">+</span> Novo cliente
        </button>
      </div>

      @if (carregando()) {
        <div class="eh-card p-6">
          <div class="flex items-center justify-between">
            <div class="eh-skeleton-title w-40"></div>
            <div class="eh-skeleton h-9 w-24 rounded-xl"></div>
          </div>
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            @for (_ of [1,2,3,4,5,6,7,8]; track _) {
              <div class="eh-skeleton h-10 rounded-xl"></div>
            }
          </div>
        </div>
      } @else {
        @if (clientes().length === 0) {
          <div class="eh-card p-10 text-center border-dashed">
            <p class="text-sm uppercase tracking-[0.16em] text-slate-400 font-semibold">Vazio</p>
            <p class="text-lg text-slate-100 font-semibold mt-3">Nenhum cliente cadastrado</p>
            <p class="text-sm text-slate-500 mt-2">Crie o primeiro cliente para começar a registrar consumos e contratos.</p>
            <button
              routerLink="/clientes/novo"
              class="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 text-white px-6 py-3 font-semibold transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(16,185,129,0.55)]"
            >
              Criar primeiro cliente
            </button>
          </div>
        } @else {
          <div class="eh-card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-950/50 border-b border-slate-800/70">
                  <tr>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">ID</th>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Nome</th>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">CNPJ</th>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Consumo</th>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Região</th>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Contrato</th>
                    <th class="px-6 py-4 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Economia</th>
                    <th class="px-6 py-4 text-right text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-800/70">
                  @for (cliente of clientes(); track cliente.id) {
                    <tr class="hover:bg-slate-950/30 transition-all duration-300">
                      <td class="px-6 py-5 text-slate-500 font-mono text-xs">#{{ cliente.id }}</td>

                      <td class="px-6 py-5 text-slate-50 font-semibold tracking-wide">{{ cliente.nome }}</td>

                      <td class="px-6 py-5 text-slate-400 font-mono text-xs">{{ cliente.cnpj }}</td>

                      <td class="px-6 py-5">
                        <span class="text-base font-semibold text-amber-200">
                          {{ cliente.consumoMedio | number:'1.0-0' }} <span class="text-xs font-semibold text-slate-500">MWh</span>
                        </span>
                      </td>

                      <td class="px-6 py-5">
                        <span class="eh-badge eh-badge-neutral">{{ cliente.regiao }}</span>
                      </td>

                      <td class="px-6 py-5">
                        <span
                          class="eh-badge"
                          [ngClass]="(cliente.statusContrato?.includes('Ativo') ?? false) ? 'eh-badge-success' : 'eh-badge-danger'"
                        >
                          {{ cliente.statusContrato }}
                        </span>
                      </td>

                      <td class="px-6 py-5">
                        <span
                          class="text-lg font-semibold"
                          [ngClass]="cliente.economiaEstimada >= 0 ? 'text-emerald-200' : 'text-red-200'"
                        >
                          R$ {{ cliente.economiaEstimada | number:'1.0-0' }}
                        </span>
                      </td>

                      <td class="px-6 py-5 text-right">
                        <div class="flex justify-end gap-3">
                          <button
                            (click)="editar(cliente.id)"
                            class="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-800/70 bg-slate-950/20 text-slate-200 hover:bg-slate-950/35 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-0.5"
                            aria-label="Editar"
                          >
                            ✏️
                          </button>

                          <button
                            (click)="deletar(cliente.id)"
                            class="w-9 h-9 flex items-center justify-center rounded-xl border border-red-500/25 bg-red-500/5 text-red-200 hover:bg-red-500/10 transition-all duration-300 hover:-translate-y-0.5"
                            aria-label="Excluir"
                          >
                            🗑️
                          </button>

                          <a
                            [routerLink]="['/contratos/novo']"
                            class="w-9 h-9 flex items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-200 hover:bg-emerald-500/10 transition-all duration-300 hover:-translate-y-0.5"
                            aria-label="Novo contrato"
                          >
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

