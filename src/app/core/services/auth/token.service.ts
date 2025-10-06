import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const ROLES_KEY = 'auth_roles';
const NAME_KEY = 'auth_name';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private _token = signal<string | null>(this.getToken());
  private _roles = signal<string[]>(this.getRoles());

  setSession(token: string, roles: string[], name: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    localStorage.setItem(NAME_KEY, name);
    this._token.set(token);
    this._roles.set(roles);
  }

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLES_KEY);
    localStorage.removeItem(NAME_KEY);
    this._token.set(null);
    this._roles.set([]);
  }

  get token() { return this._token(); }
  get roles() { return this._roles(); }
  hasRole(role: string) { return this._roles().includes(role); }

  private getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
  private getRoles(): string[] {
    try { return JSON.parse(localStorage.getItem(ROLES_KEY) || '[]'); } catch { return []; }
  }
}
