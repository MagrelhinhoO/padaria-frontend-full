import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../core/services/auth/token.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="menu-wrapper">
      <h2 class="title">Menu Principal</h2>
      <p class="subtitle">Escolha uma área para começar</p>
      <div class="grid">
        <a routerLink="/produtos" class="card">
          <h3>Produtos</h3>
          <p>Gerencie o catálogo de produtos.</p>
        </a>
        <a routerLink="/home" class="card alt">
          <h3>Bem-vindo</h3>
          <p>Visão geral inicial.</p>
        </a>
        <button type="button" class="card warn" (click)="logout()">
          <h3>Logout</h3>
          <p>Encerrar sessão atual.</p>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .menu-wrapper { max-width: 960px; margin: 1.5rem auto; padding: 0 1rem; }
    .title { margin: 0 0 .25rem; font-size: 1.75rem; font-weight:600; }
    .subtitle { margin: 0 0 1.5rem; color:#666; }
    .grid { display:grid; gap:1.1rem; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); }
  .card { background:#fff; border:1px solid #e3e6eb; border-radius:10px; padding:1rem 1rem .95rem; text-decoration:none; color:#222; box-shadow:0 4px 12px -6px rgba(0,0,0,.12); transition:box-shadow .25s, transform .22s,border-color .25s; position:relative; overflow:hidden; cursor:pointer; }
    .card:focus, .card:hover { outline:none; border-color:#0d6efd; box-shadow:0 6px 16px -6px rgba(13,110,253,.35),0 2px 6px -2px rgba(13,110,253,.25); transform:translateY(-2px); }
    .card h3 { margin:.15rem 0 .4rem; font-size:1.1rem; font-weight:600; letter-spacing:.3px; }
    .card p { margin:0; font-size:.8rem; letter-spacing:.3px; line-height:1.15rem; }
    .card.alt { background:linear-gradient(135deg,#f5f9ff,#ffffff); }
    .card.warn { background:linear-gradient(135deg,#fff5f5,#ffffff); }
  `]
})
export class MainMenuComponent {
  constructor(private token: TokenService, private router: Router) {}
  logout() {
    this.token.clear();
    this.router.navigate(['/login']);
  }
}
