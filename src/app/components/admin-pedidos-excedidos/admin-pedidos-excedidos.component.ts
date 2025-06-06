import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-pedidos-excedidos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-pedidos-excedidos.component.html',
  styleUrl: './admin-pedidos-excedidos.component.scss'
})
export class AdminPedidosExcedidosComponent implements OnInit {
  pedidos: any[] = [];

  constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.http.get<any>('http://127.0.0.1:8000/api/pedidos/excedidos').subscribe(data => {
    this.pedidos = Object.values(data).flat(); // 🔥 convierte el objeto agrupado en un array plano
  });
}

}
