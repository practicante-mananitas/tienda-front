import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { CartService } from '../../services/cart.service';
import { ShippingService } from '../../services/shipping.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  loading = true;
  direcciones: any[] = [];
  direccionSeleccionada: any = null;

  cartItems: any[] = [];
  totalProductos = 0;
  costoEnvio = 0;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private cartService: CartService,
    private shippingService: ShippingService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;

    await Promise.all([
      this.loadDirecciones(),
      this.loadCartData()
    ]);

    this.loading = false;

    if (this.direccionSeleccionada && this.cartItems.length > 0) {
      this.calcularCostoEnvio(this.direccionSeleccionada);
    }
  }

  loadDirecciones(): Promise<void> {
    return new Promise((resolve) => {
      this.addressService.getMyAddress().subscribe((res: any) => {
        this.direcciones = res;
        if (this.direcciones.length > 0) {
          this.direccionSeleccionada = this.direcciones[0];
        }
        resolve();
      });
    });
  }

  loadCartData(): Promise<void> {
    return new Promise((resolve) => {
      this.cartService.getCart().subscribe((items: any[]) => {
        this.cartItems = items;
        this.totalProductos = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        resolve();
      });
    });
  }

  calcularCostoEnvio(direccion: any) {
    if (!direccion?.codigo_postal || this.cartItems.length === 0) {
      console.warn('No hay CP o carrito vacío para cotizar envío');
      return;
    }

const items = this.cartItems.map(item => ({
  product_id: item.product_id,  // 👈 Agrega esto
  name: item.name,
  weight: item.weight,
  height: item.height,
  width: item.width,
  length: item.length,
  quantity: item.quantity
}));


    console.log('Cotizando con:', {
      codigo_postal: direccion.codigo_postal,
      // items: payloadItems
    });
console.log('Dirección seleccionada:', direccion);

this.shippingService.getShippingQuoteFromBackend(this.direccionSeleccionada.codigo_postal, items)
  .subscribe(response => {
    this.costoEnvio = response.total_price || 0;
  });
}

  onDireccionChange(dirId: number) {
    const dir = this.direcciones.find(d => d.id === dirId);
    if (dir) {
      this.direccionSeleccionada = dir;
      this.calcularCostoEnvio(dir);
    }
  }

  irANuevaDireccion() {
    this.router.navigate(['/direccion-form']);
  }

  confirmarCompra() {
    this.cartService.finalizeOrder().subscribe(() => {
      alert('Compra confirmada ✅');
      this.router.navigate(['/gracias']);
    });
  }
}
