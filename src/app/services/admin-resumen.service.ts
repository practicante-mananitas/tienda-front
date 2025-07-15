import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminResumenService {
  private API_BASE = `${environment.apiUrl}/admin/resumen`;

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
