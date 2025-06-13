import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminResumenService } from '../../services/admin-resumen.service'; // Ajusta ruta

@Component({
  selector: 'app-admin-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-resumen.component.html',
  styleUrls: ['./admin-resumen.component.scss']
})
export class AdminResumenComponent implements OnInit {

  resumen = {
    pedidosPendientes: { count: 0, pedidos: [] as any[] },
    productosBajoStock: { count: 0, productos: [] as any[] },
    pedidosRetrasados: { count: 0, pedidos: [] as any[] },
  };

  modalVisible = false;
  modalTitulo = '';
  modalContenido: any[] = [];

  constructor(private resumenService: AdminResumenService) {}

  ngOnInit() {
    this.cargarResumen();
  }

  cargarResumen() {
    this.resumenService.pedidosPendientes().subscribe(data => {
      this.resumen.pedidosPendientes = data;
    });
    this.resumenService.productosBajoStock().subscribe(data => {
      this.resumen.productosBajoStock = data;
    });
    this.resumenService.pedidosRetrasados().subscribe(data => {
      this.resumen.pedidosRetrasados = data;
    });
  }

  abrirModal(tipo: 'pedidosPendientes' | 'productosBajoStock' | 'pedidosRetrasados') {
    this.modalVisible = true;
    if (tipo === 'pedidosPendientes') {
      this.modalTitulo = `Pedidos Pendientes (${this.resumen.pedidosPendientes.count})`;
      this.modalContenido = this.resumen.pedidosPendientes.pedidos;
    } else if (tipo === 'productosBajoStock') {
      this.modalTitulo = `Productos con Poco Stock (${this.resumen.productosBajoStock.count})`;
      this.modalContenido = this.resumen.productosBajoStock.productos;
    } else if (tipo === 'pedidosRetrasados') {
      this.modalTitulo = `Pedidos Retrasados (${this.resumen.pedidosRetrasados.count})`;
      this.modalContenido = this.resumen.pedidosRetrasados.pedidos;
    }
  }

  cerrarModal() {
    this.modalVisible = false;
    this.modalContenido = [];
  }

}
