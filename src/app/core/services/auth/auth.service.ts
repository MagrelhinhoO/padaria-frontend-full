import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private baseUrl = `${environment.apiUrl}/auth`;

  login(req: LoginRequest): Observable<LoginResponse> {
    // Backend original aceitava 'username'. Se agora usamos 'email', enviamos ambos para compatibilidade.
    const payload: any = { ...req };
    if (req.email && !('username' in payload)) {
      payload.username = req.email;
    }
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload)
      .pipe(tap(res => this.tokenService.setSession(res.token, res.roles, res.name)));
  }

  logout() {
    this.tokenService.clear();
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.token;
  }
}
