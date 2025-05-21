import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AddressService } from '../../services/address.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  direcciones: any[] = [];
  direccionSeleccionada: any = null;
  costoEnvio: number = 0;
  diasEntrega: number | null = null;
  totalProductos: number = 0;
  loading = true;
  mostrarTodas = false;


  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calcularSubtotal();
        this.loadDirecciones();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadDirecciones() {
    this.addressService.getMyAddress().subscribe({
      next: (addresses) => {
        this.direcciones = Array.isArray(addresses) ? addresses : [addresses];
        this.direccionSeleccionada = this.direcciones[0];
        this.cotizarEnvio();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onDireccionChange(id: number) {
    this.direccionSeleccionada = this.direcciones.find(d => d.id === id);
    this.cotizarEnvio();
  }

  calcularSubtotal() {
    this.totalProductos = this.cartItems.reduce((acc, item) => {
      const precio = item.product?.price ?? item.price;
      return acc + (precio * item.quantity);
    }, 0);
  }

cotizarEnvio() {
  if (!this.direccionSeleccionada) return;

  this.cartService.quoteShipping(this.direccionSeleccionada.id, this.cartItems)
    .subscribe({
      next: (res) => {
        this.costoEnvio = Number(res.total) || 0;
        this.diasEntrega = (Number(res.days) || 0) + 3;
      },
      error: () => {
        this.costoEnvio = 0;
        this.diasEntrega = null;
      }
    });
}

  confirmarCompra() {
    alert('Compra confirmada. Aquí iría la lógica final para crear el pedido.');
  }

  irANuevaDireccion() {
    this.router.navigate(['/registrar-direccion']); // Ajusta esta ruta si es necesario
  }
}
