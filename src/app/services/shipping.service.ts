import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = 'https://api-demo.skydropx.com/v1/quotes'; // Sandbox
  private token = 'SXK3Aa2Tswrf6CpeMMSGx-xYuXZgxa4iErXrKTMnUgg'; // ⚠️ Pega aquí tu token

  constructor(private http: HttpClient) {}


getShippingQuoteFromBackend(destinoCP: string, items: any[]): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.post('http://127.0.0.1:8000/api/cotizar-envio', {
    codigo_postal: destinoCP,
    items: items
  }, { headers });
}


}
