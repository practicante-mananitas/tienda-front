import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ResumenFinanzas {
  resumen_general: {
    total: number;
    envio: number;
    productos: number;
  };
  ingresos_por_mes: {
    mes: string;
    total_ingresos: number;
    ingresos_envio: number;
    ingresos_productos: number;
    cantidad_pedidos: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminFinanzasService {
  private apiUrl = `${environment.apiUrl}/admin/finanzas/resumen`;

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<ResumenFinanzas> {
    return this.http.get<ResumenFinanzas>(this.apiUrl);
  }
}
