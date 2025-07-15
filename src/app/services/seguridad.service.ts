import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  cambiarContrasena(data: {
    password_actual: string;
    nueva_password: string;
    nueva_password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-contrasena`, data);
  }

  actividadReciente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/actividad-reciente`);
  }

  // Nuevo: obtener sesiones activas
  obtenerSesionesActivas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sesiones-activas`);
  }

  // Nuevo: cerrar sesión específica por id
  cerrarSesion(id: string | number): Observable<any> {
    // Asumo que usas DELETE y el id se pasa en la URL
    return this.http.delete(`${this.apiUrl}/cerrar-sesion/${id}`);
  }
}
