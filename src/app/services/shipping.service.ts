import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = `${environment.apiUrl}/cotizar-envio`; // backend URL para cotización
  private skydropxToken = 'SXK3Aa2Tswrf6CpeMMSGx-xYuXZgxa4iErXrKTMnUgg'; // Token Skydropx (deberías manejarlo seguro)

  constructor(private http: HttpClient) {}

  getShippingQuoteFromBackend(destinoCP: string, items: any[]): Observable<any> {
    const userToken = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    });

    const body = {
      codigo_postal: destinoCP,
      items: items,
      // si necesitas enviar el token Skydropx al backend, hazlo aquí,
      // pero normalmente el backend lo maneja directamente
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
