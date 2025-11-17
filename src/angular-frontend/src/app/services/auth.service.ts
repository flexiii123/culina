import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Fehler beim Laden der Benutzerdaten', e);
        this.logout();
      }
    }
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    console.log('📤 Ajax-Request wird an PHP-Backend gesendet:', {
      endpoint: `${this.apiUrl}/auth/register.php`,
      method: 'POST',
      data: { name, email, password: '***' }
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register.php`, {
      name,
      email,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          this.currentUserSubject.next(response.data.user);
          console.log('✅ Registrierung erfolgreich, Token gespeichert');
        }
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    console.log('📤 Ajax-Request wird an PHP-Backend gesendet:', {
      endpoint: `${this.apiUrl}/auth/login.php`,
      method: 'POST',
      data: { email, password: '***' }
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login.php`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          this.currentUserSubject.next(response.data.user);
          console.log('✅ Login erfolgreich, Token gespeichert');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('🔓 Benutzer abgemeldet');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
