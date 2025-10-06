import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-wrapper">
      <h2>Bem-vindo à Padaria</h2>
      <p class="lead">Use o menu acima para navegar pelos módulos do sistema.</p>
      <ul>
        <li><strong>Produtos</strong>: gerenciamento do catálogo.</li>
        <li><strong>Login</strong>: autenticação de usuários.</li>
        <li><strong>Mais módulos</strong> podem ser adicionados futuramente (relatórios, promoções, etc.).</li>
      </ul>
    </div>
  `,
  styles: [`
    .home-wrapper { max-width: 760px; margin: 1.5rem auto; }
    h2 { margin-bottom: .75rem; }
    .lead { font-size: 1rem; color: #555; margin-bottom: 1rem; }
    ul { padding-left: 1.1rem; }
    li { margin-bottom: .35rem; }
  `]
})
export class HomeComponent {}
