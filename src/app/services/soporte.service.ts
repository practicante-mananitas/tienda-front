// soporte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoporteService {
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  enviarConsulta(data: { nombre: string; correo: string; mensaje: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/soporte`, data);
  }
}
