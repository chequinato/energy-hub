import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#06131a] text-slate-100 selection:bg-cyan-400/20 selection:text-cyan-100">

      <section class="relative overflow-hidden border-b border-white/10">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_85%_20%,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_rgba(6,19,26,0.96),_rgba(3,10,16,1))]"></div>
          <div class="absolute top-24 left-[-120px] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
          <div class="absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"></div>
        </div>

        <div class="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-24 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pt-28">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200 backdrop-blur-sm">
              <span class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]"></span>
              Inteligência para gestão de energia
            </div>

            <div class="space-y-5">
              <p class="text-sm font-medium uppercase tracking-[0.35em] text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                EnergyHub
              </p>

              <h1 class="max-w-3xl text-5xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl lg:text-7xl [font-family:'Clash_Display','Sora','Plus_Jakarta_Sans',sans-serif]">
                Controle energia com
                <span class="bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  visão clara,
                </span>
                ação rápida e resultado real.
              </h1>

              <p class="max-w-2xl text-base leading-8 text-slate-300 md:text-lg [font-family:'Plus_Jakarta_Sans',sans-serif]">
                Centralize consumo, acompanhe desvios em tempo real e transforme dados técnicos em decisões mais inteligentes para operação e economia.
              </p>
            </div>

            <div class="flex flex-wrap gap-4">
              <a
                routerLink="/login"
                class="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-7 py-4 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(45,212,191,0.25)] [font-family:'Plus_Jakarta_Sans',sans-serif]"
              >
                Começar agora
              </a>

              <a
                routerLink="/dashboard"
                class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-slate-100 backdrop-blur-sm transition duration-300 hover:border-cyan-300/40 hover:bg-white/10 [font-family:'Plus_Jakarta_Sans',sans-serif]"
              >
                Ver dashboard
              </a>
            </div>

            <div class="grid max-w-2xl grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p class="text-2xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">24h</p>
                <p class="mt-2 text-sm text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                  Monitoramento contínuo dos indicadores críticos.
                </p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p class="text-2xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">-18%</p>
                <p class="mt-2 text-sm text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                  Potencial de redução com leitura clara dos dados.
                </p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p class="text-2xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">+360°</p>
                <p class="mt-2 text-sm text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                  Visão integrada entre consumo, contrato e performance.
                </p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-emerald-400/10 blur-2xl"></div>

            <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div class="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                    Painel operacional
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">
                    Visão geral da unidade
                  </h2>
                </div>

                <div class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                  Online
                </div>
              </div>

              <div class="mt-6 space-y-4">
                <div class="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                  <div class="flex items-start justify-between gap-6">
                    <div>
                      <p class="text-sm text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                        Consumo do mês
                      </p>
                      <p class="mt-3 text-4xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">
                        482 <span class="text-lg text-slate-400">MWh</span>
                      </p>
                    </div>
                    <div class="rounded-2xl bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                      +4.2%
                    </div>
                  </div>

                  <div class="mt-5 h-3 overflow-hidden rounded-full bg-white/5">
                    <div class="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
                  </div>

                  <div class="mt-3 flex justify-between text-xs text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                    <span>Meta contratada</span>
                    <span>68% utilizado</span>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p class="text-sm text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                      Real vs estimado
                    </p>
                    <p class="mt-3 text-2xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">
                      Dentro da faixa
                    </p>
                    <p class="mt-2 text-sm leading-6 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                      Desvio atual de apenas 2.8%, com estabilidade nas últimas leituras.
                    </p>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p class="text-sm text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                      Economia acumulada
                    </p>
                    <p class="mt-3 text-2xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">
                      R$ 84.320
                    </p>
                    <p class="mt-2 text-sm leading-6 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                      Resultado consolidado com contratos e acompanhamento ativo.
                    </p>
                  </div>
                </div>

                <div class="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-sm font-medium text-amber-200 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                        Alerta inteligente
                      </p>
                      <p class="mt-2 text-sm leading-6 text-amber-50/90 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                        Pico de consumo detectado fora do padrão no período noturno. Recomendamos revisar a carga das últimas 48h.
                      </p>
                    </div>
                    <span class="text-xl">⚠️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-white/10 bg-[#071821]">
        <div class="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div class="mb-12 max-w-3xl">
            <p class="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Benefícios
            </p>
            <h2 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl [font-family:'Clash_Display','Sora',sans-serif]">
              Estrutura pensada para decisão rápida e operação com mais confiança.
            </h2>
            <p class="mt-4 max-w-2xl text-base leading-8 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Uma home mais sólida precisa mostrar valor logo de cara. Por isso, organizamos a informação com mais contraste, respiro e clareza.
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/8">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">Análise</p>
              <h3 class="mt-4 text-xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">Leitura comparativa</h3>
              <p class="mt-3 text-sm leading-7 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                Compare consumo real, previsto e contratado sem depender de relatórios complexos.
              </p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/8">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">Economia</p>
              <h3 class="mt-4 text-xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">Impacto financeiro</h3>
              <p class="mt-3 text-sm leading-7 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                Destaque ganhos acumulados e oportunidades de redução com mais visibilidade.
              </p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/8">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">Alertas</p>
              <h3 class="mt-4 text-xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">Desvios automáticos</h3>
              <p class="mt-3 text-sm leading-7 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                Detecte anomalias rapidamente e aja antes que pequenos desvios virem custo.
              </p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/8">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">Experiência</p>
              <h3 class="mt-4 text-xl font-semibold text-white [font-family:'Clash_Display','Sora',sans-serif]">Interface fluida</h3>
              <p class="mt-3 text-sm leading-7 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
                Navegação mais elegante, rápida e preparada para leitura em desktop ou mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.08),_transparent_35%)]"></div>

        <div class="relative mx-auto max-w-5xl px-6 py-20 md:px-10">
          <div class="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-12 text-center shadow-xl shadow-black/20 backdrop-blur-xl md:px-14">
            <p class="text-sm uppercase tracking-[0.3em] text-cyan-300 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Pronto para começar?
            </p>

            <h3 class="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl [font-family:'Clash_Display','Sora',sans-serif]">
              Leve sua operação para um nível mais estratégico.
            </h3>

            <p class="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-400 [font-family:'Plus_Jakarta_Sans',sans-serif]">
              Crie sua conta, acompanhe seus indicadores e transforme a gestão de energia em uma rotina muito mais visual e confiável.
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <a
                routerLink="/register"
                class="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 [font-family:'Plus_Jakarta_Sans',sans-serif]"
              >
                Criar conta
              </a>

              <a
                routerLink="/login"
                class="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-white/8 [font-family:'Plus_Jakarta_Sans',sans-serif]"
              >
                Entrar na plataforma
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomePage {}
