import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // o tu URL si es diferente

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`, {
      headers: this.getAuthHeaders()
    });
  }

  repeatOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/repeat/${orderId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  
}

  

