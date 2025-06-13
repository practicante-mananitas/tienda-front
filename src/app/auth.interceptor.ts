import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtén el token de autenticación del localStorage (o de tu servicio de autenticación)
    // Asegúrate de que tu servicio de autenticación guarde el token en 'token' en localStorage.
    const token = localStorage.getItem('token');

    // Clona la petición y añade el encabezado Authorization si el token existe
    if (token) {
      // Clona la solicitud para añadir el encabezado de autorización
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Formato estándar: "Bearer TU_TOKEN"
        }
      });
    }

    // Pasa la petición (modificada o no) al siguiente manejador de la cadena
    return next.handle(request);
  }
}
