import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000/api';

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
}
