import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="eh-app min-h-screen w-full">
      <app-nav />

      <!-- fundo full -->
      <main class="w-full min-h-screen">

        <!-- container dinâmico -->
        <div
          [class.mx-auto]="router.url !== '/'"
          [class.max-w-7xl]="router.url !== '/'"
          [class.px-6]="router.url !== '/'"
          [class.sm:px-8]="router.url !== '/'"
          [class.lg:px-12]="router.url !== '/'"
          [class.py-10]="router.url !== '/'"
          class="w-full"
        >
          <router-outlet />
        </div>

      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  title = signal('EnergyHub');

  constructor(public router: Router) {}
}