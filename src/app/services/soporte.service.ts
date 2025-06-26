// soporte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoporteService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Ajusta si usas otro hostend real

  constructor(private http: HttpClient) {}

  enviarConsulta(data: { nombre: string; correo: string; mensaje: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/soporte`, data);
  }
}
