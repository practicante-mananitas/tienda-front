import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 👉 Guardar nueva dirección
  createAddress(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/address`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // 👉 Obtener dirección del usuario
  getMyAddress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/address`, {
      headers: this.getAuthHeaders()
    });
  }

  // 👉 Actualizar dirección
  updateAddress(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/address/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // 👉 Eliminar dirección
  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/direcciones/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 👉 Obtener estados
  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estados`);
  }

  // 👉 Obtener municipios por estado
  getMunicipiosByEstado(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estados/${stateId}/municipios`);
  }

  // 👉 Guardar dirección extra
  saveDireccionExtra(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/direccion-extra`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // 👉 Obtener dirección completa por ID
  getDireccionCompleta(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/direccion-completa/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 👉 Obtener información Sepomex por estado
  getSepomexPorEstado(idEstado: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sepomex/estado/${idEstado}`);
  }
}
