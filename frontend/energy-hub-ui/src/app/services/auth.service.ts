import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponseDto {
  token: string;
  userId: number;
  nome: string;
  email: string;
  expiresAt: string; // ISO string vindo do backend
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:5243/api';
  private readonly tokenKey = 'energyhub_token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private extractToken(res: any): string | null {
    const token = res?.token ?? res?.Token;
    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const exp = this.getTokenExp(token);
    if (!exp) return false;

    // exp é em segundos desde epoch
    return exp > Math.floor(Date.now() / 1000);
  }

  private getTokenExp(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
      const parsed = JSON.parse(json) as { exp?: number };
      return typeof parsed.exp === 'number' ? parsed.exp : null;
    } catch {
      return null;
    }
  }

  login(email: string, senha: string): Observable<AuthResponseDto> {
    return this.http
      .post<AuthResponseDto>(`${this.baseUrl}/auth/login`, { email, senha })
      .pipe(
        tap((res) => {
          const token = this.extractToken(res);
          if (token) this.setToken(token);
        })
      );
  }

  register(nome: string, email: string, senha: string): Observable<AuthResponseDto> {
    return this.http
      .post<AuthResponseDto>(`${this.baseUrl}/auth/register`, { nome, email, senha })
      .pipe(
        tap((res) => {
          const token = this.extractToken(res);
          if (token) this.setToken(token);
        })
      );
  }
}

