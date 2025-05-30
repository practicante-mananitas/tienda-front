import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // ✅ o tu ngrok si estás online

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerUltimoPedido(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimo-pedido`, {
      headers: this.getAuthHeaders()
    });
  }

  getMisPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-pedidos`, {
      headers: this.getAuthHeaders()
    });
  }

  repeatPedido(pedidoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/repeat-pedido/${pedidoId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }


}
