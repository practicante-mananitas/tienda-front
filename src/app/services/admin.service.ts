import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // <-- Asegúrate de importar HttpHeaders
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // ✅ Método para enviar token JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getHighlightSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/highlight-sections`);
  }

  syncSecciones(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/highlight-sync`, data, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEstadoProducto(id: number, status: string) {
    return this.http.put(`${this.apiUrl}/products/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    });
  }

  getProductosPorCategoria(categoriaId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/categorias/${categoriaId}/productos`);
  }

  getCategorias() {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  updatePedidoShipmentStatus(pedidoId: number, shipmentStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${pedidoId}/shipment-status`, { shipment_status: shipmentStatus }, {
      headers: this.getAuthHeaders()
    });
  }

  getCategoriasConSubcategoriasYProductos() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/categorias-con-subcategorias-productos`, {
      headers: this.getAuthHeaders()
    });
  }

  agregarDestacado(data: { category_id: number, product_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/categories/featured-products`, data, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarDestacado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/categories/featured-products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getFeaturedProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/admin/categories/${categoryId}/featured-products`,
      { headers: this.getAuthHeaders() }
    );
  }
}
