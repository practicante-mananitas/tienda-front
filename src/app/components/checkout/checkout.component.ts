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
  cargandoEnvio = false;

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

  this.cargandoEnvio = true;

  this.cartService.quoteShipping(this.direccionSeleccionada.id, this.cartItems)
    .subscribe({
      next: (res) => {
        console.log('🚚 Cotización recibida:', res);

        if (res.manual) {
          this.costoEnvio = 0;
          this.diasEntrega = null;
          this.cargandoEnvio = false;

          // Alerta con SweetAlert o alert simple
          alert(res.message || 'El envío será cotizado manualmente. Recibirás el costo por correo.');

          return;
        }

        this.costoEnvio = Number(res.total) || 0;
        this.diasEntrega = (Number(res.days) || 0) + 3;
        this.cargandoEnvio = false;
      },
      error: () => {
        this.costoEnvio = 0;
        this.diasEntrega = null;
        this.cargandoEnvio = false;
      }
    });
}


confirmarCompra() {
  if (this.costoEnvio === 0) {
    alert('El costo del envío se está calculando. Recibirás el monto total por correo cuando esté listo.');
    return;
  }

  const token = localStorage.getItem('token');

  const payload = {
    items: this.cartItems.map(item => {
      const product = item.product || {};
      const imagePath = product.image 
        ? `https://tusitio.com/storage/${product.image}` 
        : null;

      return {
        id: product.id,
        name: product.name || 'Producto',
        quantity: item.quantity,
        unit_price: Number(product.price ?? item.price),
        picture_url: imagePath
      };
    }),
    envio: this.costoEnvio,
    address_id: this.direccionSeleccionada.id
  };

  console.log('📦 Payload enviado:', payload);

  this.http.post<any>('http://localhost:8000/api/pago/preferencia', payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe({
    next: (res) => {
      if (res.init_point) {
        window.location.href = res.init_point;
      } else {
        alert('Error al redirigir al pago');
      }
    },
    error: () => {
      alert('Ocurrió un error al preparar el pago');
    }
  });
}







  irANuevaDireccion() {
    this.router.navigate(['/registrar-direccion']); // Ajusta esta ruta si es necesario
  }

  getDireccionesVisibles() {
    const primeras = this.direcciones.slice(0, 2);
    if (
      this.direccionSeleccionada &&
      !primeras.find(dir => dir.id === this.direccionSeleccionada.id)
    ) {
      // Incluye la seleccionada y solo una de las primeras para que sean máximo 2
      const otra = primeras[0]; // solo una para mantener el total en 2
      return [this.direccionSeleccionada, otra];
    }
    // Si ya está incluida en las primeras, solo muestra esas
    return primeras;
  }
}
