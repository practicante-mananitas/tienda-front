import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Importar environment

@Component({
  selector: 'app-admin-pedidos-excedidos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-pedidos-excedidos.component.html',
  styleUrls: ['./admin-pedidos-excedidos.component.scss'] // corregido a styleUrls
})
export class AdminPedidosExcedidosComponent implements OnInit {
  pedidos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrl}/pedidos/excedidos`).subscribe({
      next: (data) => {
        this.pedidos = Object.values(data).flat();
      },
      error: (err) => {
        console.error('Error al cargar pedidos excedidos:', err);
      }
    });
  }
}
