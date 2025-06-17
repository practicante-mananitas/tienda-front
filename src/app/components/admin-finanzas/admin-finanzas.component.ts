import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFinanzasService } from '../../services/admin-finanzas.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-finanzas',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './admin-finanzas.component.html',
  styleUrls: ['./admin-finanzas.component.scss']
})
export class AdminFinanzasComponent implements OnInit {
  resumenGeneral: any = null;
  ingresosPorMes: any[] = [];
  ingresosPorMesFiltrados: any[] = [];
  cargando = true;

  aniosDisponibles: number[] = [];
  anioSeleccionado!: number;
  paginaActual: number = 1;
  mesesPorPagina: number = 3;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Ingresos por Mes' }
    }
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [], label: 'Productos', backgroundColor: '#28a745' },
      { data: [], label: 'Envío', backgroundColor: '#ffc107' },
      { data: [], label: 'Total', backgroundColor: '#007bff' }
    ]
  };

  public barChartType: 'bar' = 'bar';

  constructor(private finanzasService: AdminFinanzasService) {}

  ngOnInit(): void {
    this.finanzasService.obtenerResumen().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.resumenGeneral = data.resumen_general;
        this.ingresosPorMes = data.ingresos_por_mes;

        // Extraer años disponibles
        const años = new Set<number>();
        this.ingresosPorMes.forEach(item => {
          const year = parseInt(item.mes.split('-')[0]);
          años.add(year);
        });
        this.aniosDisponibles = Array.from(años).sort((a, b) => b - a);
        this.anioSeleccionado = this.aniosDisponibles[0]; 

        this.actualizarDatos();

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener resumen de finanzas', err);
        this.cargando = false;
      }
    });
  }

  actualizarDatos() {
    // Filtrar y paginar ingresosPorMes
    const filtrados = this.ingresosPorMes.filter(i => i.mes.startsWith(this.anioSeleccionado.toString()));
    this.ingresosPorMesFiltrados = filtrados.slice((this.paginaActual - 1) * this.mesesPorPagina, this.paginaActual * this.mesesPorPagina);

    // Actualizar etiquetas y datos para la gráfica
    this.barChartLabels = this.ingresosPorMesFiltrados.map(item => item.mes);
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        {
          label: 'Productos',
          data: this.ingresosPorMesFiltrados.map(item => +item.ingresos_productos),
          backgroundColor: '#28a745'
        },
        {
          label: 'Envío',
          data: this.ingresosPorMesFiltrados.map(item => +item.ingresos_envio),
          backgroundColor: '#ffc107'
        },
        {
          label: 'Total',
          data: this.ingresosPorMesFiltrados.map(item => +item.total_ingresos),
          backgroundColor: '#007bff'
        }
      ]
    };
  }

  filtrarMesesPorAnio(anio: number) {
    this.paginaActual = 1;
    this.anioSeleccionado = anio;
    this.actualizarDatos();
  }

  cambiarPagina(direccion: 'prev' | 'next') {
    const totalMesesFiltrados = this.ingresosPorMes.filter(i => i.mes.startsWith(this.anioSeleccionado.toString())).length;
    const totalPaginas = Math.ceil(totalMesesFiltrados / this.mesesPorPagina);

    if (direccion === 'prev' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'next' && this.paginaActual < totalPaginas) {
      this.paginaActual++;
    }
    this.actualizarDatos();
  }

  get totalPaginas(): number {
    const totalMesesFiltrados = this.ingresosPorMes.filter(i => i.mes.startsWith(this.anioSeleccionado.toString())).length;
    return Math.ceil(totalMesesFiltrados / this.mesesPorPagina);
  }

  get estaUltimaPagina(): boolean {
    return this.paginaActual >= this.totalPaginas;
  }


}
