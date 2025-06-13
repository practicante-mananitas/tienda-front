import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSpinner, faTruck, faBox, faCheckCircle, faTimesCircle, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgIf,
    NgFor,
    FormsModule,
    FaIconComponent // IMPORTANTE: Agregar el componente de FontAwesome
  ],
  styleUrls: ['./admin-pedidos.component.scss']
})
export class AdminPedidosComponent implements OnInit {
  pedidos: any[] = [];
  pedidoItems: { [key: number]: any[] } = {};
  pedidoItemsVisibles: { [key: number]: boolean } = {};
  showDetailsModal: boolean = false;
  selectedPedido: any | null = null;
  loadingDetails: boolean = false;
  detailsError: string | null = null;
  isLoadingPedidos: boolean = false;

  // Íconos FontAwesome
  faSpinner = faSpinner;
  faEye = faEye;

  // Estados de envío con íconos y estilos
  getShipmentStatusInfo(status: string) {
    const info: any = {
      'in_process': { text: 'En Proceso', icon: faSpinner, colorClass: 'text-blue' },
      'sent': { text: 'Enviado', icon: faTruck, colorClass: 'text-orange' },
      'delivered': { text: 'Entregado', icon: faCheckCircle, colorClass: 'text-green' },
      'cancelled': { text: 'Cancelado', icon: faTimesCircle, colorClass: 'text-red' }
    };
    return info[status] || { text: 'Desconocido', icon: faTimesCircle, colorClass: 'text-gray' };
  }

  statesMap: { [key: string]: string } = {
    '1': 'Aguascalientes', '2': 'Baja California', '3': 'Baja California Sur',
    '4': 'Campeche', '5': 'Chiapas', '6': 'Chihuahua', '7': 'Ciudad de México',
    '8': 'Coahuila de Zaragoza', '9': 'Colima', '10': 'Durango', '11': 'Guanajuato',
    '12': 'Guerrero', '13': 'Hidalgo', '14': 'Jalisco', '15': 'México',
    '16': 'Michoacán de Ocampo', '17': 'Morelos', '18': 'Nayarit', '19': 'Nuevo León',
    '20': 'Oaxaca', '21': 'Puebla', '22': 'Querétaro', '23': 'Quintana Roo',
    '24': 'San Luis Potosí', '25': 'Sinaloa', '26': 'Sonora', '27': 'Tabasco',
    '28': 'Tamaulipas', '29': 'Tlaxcala', '30': 'Veracruz de Ignacio de la Llave',
    '31': 'Yucatán', '32': 'Zacatecas'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.isLoadingPedidos = true;
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/pedidos').subscribe({
      next: (data) => {
        this.pedidos = data;
        this.pedidos.forEach(pedido => {
          this.pedidoItemsVisibles[pedido.id] = false;
          pedido.isUpdatingShipmentStatus = false; // asegúrate que esto existe
        });
        this.isLoadingPedidos = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar pedidos:', err);
        this.isLoadingPedidos = false;
        alert('Error al cargar los pedidos.');
      }
    });
  }

  getStateName(stateId: string | number): string {
    return this.statesMap[String(stateId)] || 'Desconocido';
  }

  toggleDetalle(pedidoId: number) {
    if (this.pedidoItemsVisibles[pedidoId]) {
      this.pedidoItemsVisibles[pedidoId] = false;
      return;
    }

    if (!this.pedidoItems[pedidoId]) {
      this.http.get<any[]>(`http://127.0.0.1:8000/api/admin/pedidos/${pedidoId}/items`).subscribe({
        next: (data) => {
          this.pedidoItems[pedidoId] = data;
          this.pedidoItemsVisibles[pedidoId] = true;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cargar items del pedido:', err);
        }
      });
    } else {
      this.pedidoItemsVisibles[pedidoId] = true;
    }
  }

  openPedidoDetailsModal(pedidoId: number) {
    this.showDetailsModal = true;
    this.selectedPedido = null;
    this.loadingDetails = true;
    this.detailsError = null;

    this.http.get<any>(`http://127.0.0.1:8000/api/admin/pedidos/${pedidoId}/details`).subscribe({
      next: (data) => {
        this.selectedPedido = data;
        this.loadingDetails = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar detalles completos del pedido:', err);
        this.loadingDetails = false;
        this.detailsError = 'Error al cargar los detalles del pedido. Por favor, intenta de nuevo.';
      }
    });
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedPedido = null;
    this.detailsError = null;
  }

  updateShipmentStatus(pedido: any, nuevoStatus: string) {
    pedido.isUpdatingShipmentStatus = true;

    this.http.put(`http://127.0.0.1:8000/api/admin/pedidos/${pedido.id}/shipment-status`, {
      shipment_status: nuevoStatus
    }).subscribe({
      next: () => {
        pedido.isUpdatingShipmentStatus = false;
        console.log(`Estado de envío actualizado: ${nuevoStatus}`);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar el estado de envío:', err);
        pedido.isUpdatingShipmentStatus = false;
        alert('Error al actualizar el estado de envío.');
      }
    });
  }

}
