import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL de tu API Laravel

  constructor(private http: HttpClient) {}

  register(data: {   
    name: string; 
    email: string; 
    password: string;
    // address: string;  
    phone: string; 
    latitude: number; 
    longitude: number; 
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

login(data: { email: string; password: string }): Observable<any> {
  return new Observable((observer) => {
    this.http.post(`${this.apiUrl}/login`, data).subscribe({
      next: (res: any) => {
        const token = res.access_token;
        const refreshToken = res.refresh_token;
        const sessionId = res.session_id;

        this.saveToken(token);
        localStorage.setItem('refresh_token', refreshToken);


        // Guardar session_id en localStorage
        localStorage.setItem('session_id', sessionId.toString());

        // ahora pedimos los datos del usuario
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        this.http.get(`${this.apiUrl}/me`, { headers }).subscribe({
          next: (user: any) => {
            localStorage.setItem('usuario', JSON.stringify(user));
            observer.next({ token, user, sessionId });
          },
          error: (err) => observer.error(err)
        });
      },
      error: (err) => observer.error(err)
    });
  });
}

  refreshAccessToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return new Observable((observer) => observer.error('No hay refresh token'));

    return new Observable((observer) => {
      this.http.post(`${this.apiUrl}/refresh-token`, { refresh_token: refreshToken }).subscribe({
        next: (res: any) => {
          const newToken = res.access_token;
          this.saveToken(newToken);
          observer.next(newToken);
          observer.complete();
        },
        error: (err) => {
          this.clearSession();
          observer.error(err);
        }
      });
    });
  }



  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Aquí modificamos logout para llamar al backend y eliminar token local después
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return new Observable((observer) => {
      this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
        next: (res) => {
          this.clearSession();
          observer.next(res);
          observer.complete();
        },
        error: (err) => {
          this.clearSession();
          observer.error(err);
        }
      });
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  checkSession(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return new Observable<boolean>((observer) => observer.next(false));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return new Observable<boolean>((observer) => {
      this.http.get(`${this.apiUrl}/me`, { headers }).subscribe({
        next: () => observer.next(true),
        error: () => {
          this.clearSession();
          observer.next(false);
        }
      });
    });
  }

  obtenerUsuario() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  // Limpia sesión local
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('refresh_token');
  }
}
