import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFinanzasService } from '../../services/admin-finanzas.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-admin-finanzas',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FormsModule],
  templateUrl: './admin-finanzas.component.html',
  styleUrls: ['./admin-finanzas.component.scss']
})
export class AdminFinanzasComponent implements OnInit, OnDestroy {
  resumenGeneral: any = null;
  ingresosPorMes: any[] = [];
  ingresosPorMesFiltrados: any[] = [];
  cargando = true;

  aniosDisponibles: number[] = [];
  anioSeleccionado!: number;
  paginaActual: number = 1;
  mesesPorPagina: number = 3;

  // Opciones gráfico barras con datalabels
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Ingresos por Mes' },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value: number) => value.toLocaleString()
      }
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

  // Opciones gráfico doughnut con datalabels
  public doughnutChartLabels: string[] = ['Productos', 'Envío', 'Total'];
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#28a745', '#ffc107', '#007bff']
      }
    ]
  };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Ingresos Totales' },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value: number) => value.toLocaleString()
      }
    }
  };

  public chartType: 'bar' | 'doughnut' = 'bar';

  private resizeListener = () => this.setChartTypeBasedOnScreen();

  constructor(private finanzasService: AdminFinanzasService) {}

  ngOnInit(): void {
    this.setChartTypeBasedOnScreen();
    window.addEventListener('resize', this.resizeListener);

    this.finanzasService.obtenerResumen().subscribe({
      next: (data) => {
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

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  setChartTypeBasedOnScreen() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.chartType = isMobile ? 'doughnut' : 'bar';
  }

  actualizarDatos() {
    const filtrados = this.ingresosPorMes.filter(i => i.mes.startsWith(this.anioSeleccionado.toString()));
    this.ingresosPorMesFiltrados = filtrados.slice((this.paginaActual - 1) * this.mesesPorPagina, this.paginaActual * this.mesesPorPagina);

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

    // Actualizar datos para doughnut con la suma total visible
    const sumaProductos = this.ingresosPorMesFiltrados.reduce((acc, cur) => acc + Number(cur.ingresos_productos), 0);
    const sumaEnvio = this.ingresosPorMesFiltrados.reduce((acc, cur) => acc + Number(cur.ingresos_envio), 0);
    const sumaTotal = this.ingresosPorMesFiltrados.reduce((acc, cur) => acc + Number(cur.total_ingresos), 0);

    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: [sumaProductos, sumaEnvio, sumaTotal],
          backgroundColor: ['#28a745', '#ffc107', '#007bff']
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
