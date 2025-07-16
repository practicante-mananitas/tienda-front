import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor, TitleCasePipe, Location } from '@angular/common'; // Importa DatePipe, NgIf, NgFor, TitleCasePipe
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service'; // Asegúrate de que OrderService exista y lo estés usando para misPedidos
import { Router, RouterLink } from '@angular/router'; // Importar RouterLink para los botones
import { PedidoService } from '../../services/pedido.service'; // Este es el que usarás para getMisPedidos
import { environment } from '../../../environments/environment'; // 👈 ajusta la ruta si es necesario

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgIf,
    NgFor,
    TitleCasePipe, // Para el pipe titlecase
    RouterLink // Para usar routerLink en los botones
  ],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})
export class MisPedidosComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  storageUrl = environment.storageUrl; // 👈 Aquí guardamos la URL base

  // NUEVO: Mapa de estados de México
  statesMap: { [key: string]: string } = {
    '1': 'Aguascalientes', '2': 'Baja California', '3': 'Baja California Sur',
    '4': 'Campeche', '5': 'Chiapas', '6': 'Chihuahua', '7': 'Ciudad de México',
    '8': 'Coahuila de Zaragoza', '9': 'Colima', '10': 'Durango',
    '11': 'Guanajuato', '12': 'Guerrero', '13': 'Hidalgo',
    '14': 'Jalisco', '15': 'México', '16': 'Michoacán de Ocampo',
    '17': 'Morelos', '18': 'Nayarit', '19': 'Nuevo León',
    '20': 'Oaxaca', '21': 'Puebla', '22': 'Querétaro',
    '23': 'Quintana Roo', '24': 'San Luis Potosí', '25': 'Sinaloa',
    '26': 'Sonora', '27': 'Tabasco', '28': 'Tamaulipas',
    '29': 'Tlaxcala', '30': 'Veracruz de Ignacio de la Llave',
    '31': 'Yucatán', '32': 'Zacatecas',
  };

  constructor(
    private orderService: OrderService, // Si usas este para obtener los pedidos del usuario
    private router: Router,
    private pedidoService: PedidoService, // Asumiendo que es el servicio que llama al backend para misPedidos
    private cartService: CartService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.pedidoService.getMisPedidos().subscribe({
      next: (res: any[]) => {
        // Los datos ya vienen con todas las relaciones y el cálculo hecho desde el backend
        this.orders = res; 
        console.log('Mis pedidos cargados:', this.orders); // Para depuración
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar mis pedidos:', err);
        this.error = 'No se pudieron cargar tus pedidos.';
        this.orders = [];
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.location.back();
  }

  // Función para obtener el nombre del estado
  getStateName(stateId: string | number): string {
    const idAsString = String(stateId); 
    return this.statesMap[idAsString] || 'Desconocido';
  }

  repeat(pedidoId: number): void {
    this.pedidoService.repeatPedido(pedidoId).subscribe({
      next: (products) => {
        products.forEach((p: any) => {
          this.cartService.addToCart(p.product_id, p.quantity).subscribe();
        });
        alert('Productos agregados al carrito');
        this.router.navigate(['/carrito']);
      },
      error: (err) => {
        console.error('Error al repetir el pedido:', err);
        alert('No se pudo repetir el pedido');
      }
    });
  }

  irATienda() {
    this.router.navigate(['/tienda']); // Cambia la ruta según tu app
  }

}
