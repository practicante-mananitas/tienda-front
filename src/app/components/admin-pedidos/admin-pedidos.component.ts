import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  imports: [CommonModule],
  styleUrls: ['./admin-pedidos.component.scss']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: any[] = [];
  pedidoItems: { [key: number]: any[] } = {};
  pedidoItemsVisibles: { [key: number]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/pedidos').subscribe(data => {
      this.pedidos = data;
    });
  }

  toggleDetalle(pedidoId: number) {
    if (this.pedidoItemsVisibles[pedidoId]) {
      this.pedidoItemsVisibles[pedidoId] = false;
      return;
    }

    if (!this.pedidoItems[pedidoId]) {
      this.http.get<any[]>(`http://127.0.0.1:8000/api/admin/pedidos/${pedidoId}/items`).subscribe(data => {
        this.pedidoItems[pedidoId] = data;
        this.pedidoItemsVisibles[pedidoId] = true;
      });
    } else {
      this.pedidoItemsVisibles[pedidoId] = true;
    }
  }
}
