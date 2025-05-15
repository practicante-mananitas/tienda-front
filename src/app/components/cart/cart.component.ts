import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService, 
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: data => this.cartItems = data,
      error: () => alert('Error al cargar el carrito')
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id).subscribe({
      next: () => this.loadCart(),
      error: () => alert('Error al eliminar')
    });
  }

  clearCart() {
    if (confirm('¿Vaciar carrito?')) {
      this.cartService.clearCart().subscribe({
        next: () => this.loadCart(),
        error: () => alert('Error al vaciar')
      });
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  finalizeOrder() {
    this.cartService.finalizeOrder().subscribe({
      next: () => {
        alert('Pedido realizado con éxito!');
        this.router.navigate(['/checkout']);
      },
      error: () => alert('Hubo un error al finalizar el pedido.')
    });
  }
  
  volver() {
    this.location.back();
  }

  goToCheckout() {
  this.router.navigate(['/checkout']);
}

}
