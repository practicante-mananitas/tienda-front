import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Endpoints públicos
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
            if (!this.isRefreshing) {
              this.isRefreshing = true;

              return this.authService.refreshAccessToken().pipe(
                switchMap((newToken: string) => {
                  this.isRefreshing = false;

                  // Actualiza la cabecera con el nuevo token
                  const clonedReq = request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`
                    }
                  });

                  return next.handle(clonedReq);
                }),
                catchError(err => {
                  this.isRefreshing = false;

                  // No se pudo refrescar, logout y redirigir
                  alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
                  this.authService.logout().subscribe(() => {
                    this.router.navigate(['/login']);
                  });

                  return throwError(() => err);
                })
              );
            } else {
              // Si ya está refrescando, simplemente redirigir logout (evita múltiples llamadas)
              alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
              this.authService.logout().subscribe(() => {
                this.router.navigate(['/login']);
              });
            }
          }
        }

        return throwError(() => error);
      })
    );
  }
}
