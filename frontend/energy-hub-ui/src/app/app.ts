
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="eh-app">
      <app-nav />
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  title = signal('EnergyHub');
}

