import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-confirmado.component.html',
  styleUrl: './pedido-confirmado.component.scss'
})
export class PedidoConfirmadoComponent {
  resumen: any;

  constructor(private cartService: CartService) {
    this.resumen = this.cartService.orderSummary;
  }
}
