import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Lista de endpoints públicos (puedes agregar más si los necesitas)
    const publicEndpoints = [
      '/login',
      '/register',
      '/categories',
      '/highlight-sections'
    ];

    const isPublic = publicEndpoints.some(url => request.url.includes(url));

    if (token && !isPublic) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const isLoginOrRegister = request.url.includes('/login') || request.url.includes('/register');

          if (!isLoginOrRegister) {
            const mensaje = error.error?.mensaje || 'Tu sesión ha expirado o es inválida.';
            alert(mensaje);
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }

        return throwError(() => error);
      })
    );
  }
}
