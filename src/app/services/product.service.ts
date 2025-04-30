import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Ajusta si usas otro host

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, {
      headers: this.getAuthHeaders()
    });
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createProduct(product: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
      // 👇 NO pongas Content-Type, Angular lo pone solo con FormData
    });
  
    return this.http.post(`${this.apiUrl}/products`, product, { headers });
  }
  

  updateProduct(id: number, product: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}/products/${id}?_method=PUT`, product, { headers });
  }
  

  deleteProduct(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers });
  }
  
}
