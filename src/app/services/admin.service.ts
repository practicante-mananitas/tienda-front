import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Asegúrate que tu backend esté ahí

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getHighlightSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/highlight-sections`);
  }

  syncSecciones(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/highlight-sync`, data);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }

  actualizarEstadoProducto(id: number, activo: boolean) {
    return this.http.put(`${this.apiUrl}/productos/${id}/estado`, { activo });
  }

  getProductosPorCategoria(categoriaId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/categorias/${categoriaId}/productos`);
  }

  getCategorias() {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }
}
