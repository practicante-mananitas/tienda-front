import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pago-exito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pago-exito.component.html',
  styleUrls: ['./pago-exito.component.scss']
})
export class PagoExitoComponent implements OnInit {

    pedido: any = null;

  constructor(private cartService: CartService, 
    private router: Router,
    private pedidoService: PedidoService
  ) {}

ngOnInit(): void {
  this.pedidoService.obtenerUltimoPedido().subscribe({
    next: (res) => {
      this.pedido = res;

      // ✅ Vacía carrito solo si hay pedido válido
      if (this.router.url.includes('/pago/exito')) {
        this.cartService.clearCart().subscribe({
          next: () => console.log('🧼 Carrito vaciado con éxito'),
          error: () => console.warn('No se pudo vaciar el carrito')
        });
      }
    },
    error: () => this.pedido = null
  });
}


  volver(): void {
    this.router.navigate(['/']);
  }
}
