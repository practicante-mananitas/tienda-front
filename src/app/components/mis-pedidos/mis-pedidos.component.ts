import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service'; // o OrderService si prefieres separarlo
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})
export class MisPedidosComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService, 
    private router: Router,
    private pedidoService: PedidoService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
  this.pedidoService.getMisPedidos().subscribe({
  next: (res: any[]) => {
    this.orders = res.map((pedido: any) => {
      const envioItem = pedido.items.find((item: any) => item.product === null);
      const productos = pedido.items.filter((item: any) => item.product !== null);

      return {
        ...pedido,
        envio: envioItem ? Number(envioItem.precio_unitario) : 0,
        subtotal: productos.reduce((acc: number, item: any) => acc + (item.precio_unitario * item.cantidad), 0),
        items: productos
      };
    });
  },
  error: () => this.orders = []
});

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
      error: () => alert('No se pudo repetir el pedido')
    });
  }

  
  
}
