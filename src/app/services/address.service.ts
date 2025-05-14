import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // ajusta si usas un dominio

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

  // 👉 Actualizar dirección (si decides permitirlo)
  updateAddress(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/address/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estados`);
  }

  getMunicipiosByEstado(stateId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/estados/${stateId}/municipios`);
}

saveDireccionExtra(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/direccion-extra`, data, {
    headers: this.getAuthHeaders()
  });
}

getDireccionCompleta(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/direccion-completa/${id}`, {
    headers: this.getAuthHeaders()
  });
}

}
