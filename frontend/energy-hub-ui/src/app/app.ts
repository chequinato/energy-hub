
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="eh-app min-h-screen w-full">
      <app-nav />

      <main class="w-full min-h-screen">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  title = signal('EnergyHub');
}
