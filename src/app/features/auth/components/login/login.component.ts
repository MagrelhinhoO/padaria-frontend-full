import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { TokenService } from '../../../../core/services/auth/token.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private router = inject(Router);
  private tokenService = inject(TokenService);

  email = '';
  password = '';
  loading = signal(false);

  private readonly staticEmail = 'admin@exemplo.com';
  private readonly staticPass = 'admin123';

  submit(): void {
    this.loading.set(true);
    // Simulação de login estático
    if (this.email === this.staticEmail && this.password === this.staticPass) {
      // setSession(token: string, roles: string[], name: string)
      this.tokenService.setSession(
        'static-jwt-token-for-root',
        ['admin', 'user'],
        'Administrador'
      );
      this.router.navigate(['/menu']);
    } else {
      // Exibe uma mensagem de erro se as credenciais estiverem incorretas
      Swal.fire({
        title: 'Erro de Login',
        text: 'Email ou senha inválidos.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
      });
    }
    this.loading.set(false);
  }
}
