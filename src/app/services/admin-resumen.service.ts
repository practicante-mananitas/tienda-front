import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminResumenService {
  private API_BASE = 'http://localhost:8000/api/admin/resumen'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  pedidosPendientes(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE}/pedidos-pendientes`);
  }

  productosBajoStock(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE}/productos-bajo-stock`);
  }

  pedidosRetrasados(): Observable<any> {
    return this.http.get<any>(`${this.API_BASE}/pedidos-retrasados`);
  }

  productosPorCategoria(): Observable<{ categoria: string; total: number }[]> {
    return this.http.get<{ categoria: string; total: number }[]>(`${this.API_BASE}/productos-categoria`);
  }
}
