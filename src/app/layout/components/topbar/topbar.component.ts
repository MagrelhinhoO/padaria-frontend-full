import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="topbar">
      <a routerLink="/produtos">Produtos</a> |
      <a routerLink="/login">Login</a>
    </nav>
  `,
  styles: [`
    .topbar { background: #333; color: #fff; padding: .75rem; }
    a { color: #fff; margin-right: .75rem; text-decoration: none; }
    a:hover { text-decoration: underline; }
  `]
})
export class TopbarComponent {}
