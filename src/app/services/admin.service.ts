import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Asegúrate que tu backend esté ahí

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`); // Cambiado de 'productos' a 'products'
  }

  getHighlightSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/highlight-sections`);
  }

  syncSecciones(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/highlight-sync`, data);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`); // Cambiado de 'productos' a 'products'
  }

  // --- CORRECCIÓN CLAVE AQUÍ ---
  // 1. Cambiado 'productos' a 'products'
  // 2. Cambiado 'estado' a 'status'
  // 3. La propiedad enviada en el body es 'status' y su valor debe ser 'active', 'paused', 'disabled'
  actualizarEstadoProducto(id: number, status: string) { // Cambiado 'activo: boolean' a 'status: string'
    return this.http.put(`${this.apiUrl}/products/${id}/status`, { status });
  }

  getProductosPorCategoria(categoriaId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/categorias/${categoriaId}/productos`); // Cambiado de 'productos' a 'products'
  }

  getCategorias() {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

    // Actualiza el estado de envío de un pedido específico
  updatePedidoShipmentStatus(pedidoId: number, shipmentStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${pedidoId}/shipment-status`, { shipment_status: shipmentStatus });
  }
}
