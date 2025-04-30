import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service'; // o OrderService si prefieres separarlo
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})
export class MisPedidosComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: data => this.orders = data,
      error: () => alert('No se pudieron cargar los pedidos.')
    });
  }

  repeat(orderId: number) {
    this.orderService.repeatOrder(orderId).subscribe({
      next: () => {
        alert('Pedido agregado al carrito');
        this.router.navigate(['/carrito']); // ✅ redirección automática
      },
      error: () => alert('Error al volver a comprar')
    });
  }
  
  
}
