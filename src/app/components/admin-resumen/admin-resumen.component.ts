import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminResumenService } from '../../services/admin-resumen.service'; // Ajusta ruta
import { Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-admin-resumen',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
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
  public chartLabels: string[] = [];
public chartData: number[] = [];
public chartReady = false;
public chartType: ChartType = 'bar'; // o 'pie', 'line', etc.
public chartOptions: ChartConfiguration['options'] = {
  responsive: true,
  scales: {
    x: {},
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Productos por Categoría',
    }
  }
};



  constructor(private resumenService: AdminResumenService,
    private router: Router 
  ) {}

ngOnInit() {
  this.cargarResumen();

  this.resumenService.productosPorCategoria().subscribe(data => {
    this.chartLabels = data.map(item => item.categoria);
    this.chartData = data.map(item => item.total);

    this.chartType = window.innerWidth < 768 ? 'doughnut' : 'bar';
    this.chartReady = true;
  });

  // Escuchar cambios de tamaño opcionalmente
  window.addEventListener('resize', () => {
    const nuevoTipo = window.innerWidth < 768 ? 'doughnut' : 'bar';
    if (this.chartType !== nuevoTipo) {
      this.chartType = nuevoTipo;
    }
  });
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

  obtenerKeys(obj: any): string[] {
  return Object.keys(obj).filter(k => typeof obj[k] !== 'object');
}

irDetalle(item: any) {  
  if (this.modalTitulo.includes('Pedidos')) {
    this.router.navigate(['/admin-panel/pedidos'], { queryParams: { scrollTo: item.id } });
    this.cerrarModal();
  } else if (this.modalTitulo.includes('Productos')) {
    // Cambiar 'admin-products' por 'productos' que es la ruta correcta
    this.router.navigate(['/admin-panel/productos'], { queryParams: { scrollTo: item.id } });
    this.cerrarModal();
  }
}






}
