import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- HEADER -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-display-md font-semibold tracking-[-0.03em] text-slate-50">Meu Perfil</h1>
          <p class="eh-muted mt-2 max-w-3xl">
            Visualize e gerencie suas informações de cadastro.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="eh-badge eh-badge-neutral">Configurações</span>
        </div>
      </div>

      <!-- Error Message -->
      @if (erro()) {
        <div class="eh-card p-4 border-red-500/30 bg-red-500/5">
          <p class="text-sm text-red-200 font-semibold tracking-wide">Falha ao carregar</p>
          <p class="text-sm text-red-200/80 mt-1">{{ erro() }}</p>
        </div>
      }

      <!-- Loading -->
      @if (carregando()) {
        <div class="eh-card p-8">
          <div class="space-y-4">
            <div class="eh-skeleton-title w-48"></div>
            <div class="eh-skeleton-line w-64"></div>
            <div class="eh-skeleton-line w-56"></div>
          </div>
        </div>
      }

      <!-- Perfil Info -->
      @if (usuario() && !carregando()) {
        <div class="eh-card eh-card-hover p-8">
          <div class="flex items-start gap-6">
            <!-- Avatar Grande -->
            <div class="flex-shrink-0">
              <div class="h-20 w-20 rounded-2xl border border-slate-800/80 bg-slate-900/40 ring-1 ring-white/5 flex items-center justify-center">
                <span class="text-2xl font-semibold text-slate-200">👤</span>
              </div>
            </div>

            <!-- Informações -->
            <div class="flex-1 space-y-6">
              <div>
                <h2 class="text-xl font-semibold text-slate-50 mb-4">{{ usuario()?.nome }}</h2>
                
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-xs text-slate-400 mb-1 font-semibold tracking-wide">Nome Completo</label>
                    <p class="text-slate-100 font-medium">{{ usuario()?.nome }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-xs text-slate-400 mb-1 font-semibold tracking-wide">E-mail</label>
                    <p class="text-slate-100 font-medium">{{ usuario()?.email }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-xs text-slate-400 mb-1 font-semibold tracking-wide">ID do Usuário</label>
                    <p class="text-slate-100 font-medium">#{{ usuario()?.id }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-xs text-slate-400 mb-1 font-semibold tracking-wide">Membro desde</label>
                    <p class="text-slate-100 font-medium">{{ usuario()?.createdAt | date:'dd/MM/yyyy' }}</p>
                  </div>
                </div>
              </div>

              <!-- Botões de Ação -->
              <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-800/50">
                <button class="rounded-xl bg-gradient-to-r from-cyan-500/90 to-blue-500/90 hover:from-cyan-400 hover:to-blue-400 text-white px-5 py-2.5 text-sm font-semibold shadow-[0_16px_40px_-30px_rgba(34,211,238,0.75)] transition-all duration-300 hover:shadow-[0_18px_50px_-30px_rgba(59,130,246,0.80)]">
                  📝 Editar Perfil
                </button>
                
                <button class="rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/60 text-slate-100 px-5 py-2.5 text-sm font-semibold transition-all duration-300">
                  🔑 Alterar Senha
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Seção de Senha (Placeholder) -->
      <div class="eh-card p-6 opacity-60">
        <div class="flex items-center justify-between gap-4 mb-4">
          <div>
            <p class="eh-section-title">Senha</p>
            <p class="eh-muted text-sm mt-1">Funcionalidade de alteração de senha em desenvolvimento.</p>
          </div>
          <span class="eh-badge eh-badge-warning">Em Breve</span>
        </div>
        
        <div class="rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/15 p-6 text-center">
          <p class="text-sm text-slate-400 font-semibold">🔐 Alteração de senha disponível em breve</p>
          <p class="text-xs text-slate-500 mt-1">Estamos trabalhando nesta funcionalidade.</p>
        </div>
      </div>

    </div>
  `,
  styles: []
})
export class PerfilPage {
  private apiService = inject(ApiService);

  usuario = signal<Usuario | null>(null);
  carregando = signal(true);
  erro = signal<string>('');

  constructor() {
    this.loadPerfil();
  }

  loadPerfil() {
    this.carregando.set(true);
    this.erro.set('');

    this.apiService.getUsuarioPerfil().subscribe({
      next: (data: Usuario) => {
        this.usuario.set(data);
        this.carregando.set(false);
      },
      error: (err: any) => {
        console.error('Erro ao carregar perfil:', err);
        this.erro.set('Erro ao carregar dados do perfil. Verifique a conexão com o backend.');
        this.carregando.set(false);
      }
    });
  }
}
