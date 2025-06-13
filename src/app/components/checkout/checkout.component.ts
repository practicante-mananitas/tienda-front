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
  cargandoPago = false;


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
      error: (err) => { // Agregado manejo de error para el log
        console.error('Error al cargar items del carrito:', err);
        this.loading = false;
      }
    });
  }

  loadDirecciones() {
    this.addressService.getMyAddress().subscribe({
      next: (addresses) => {
        this.direcciones = Array.isArray(addresses) ? addresses : [addresses];
        // Selecciona la primera dirección si existe
        if (this.direcciones.length > 0) {
            this.direccionSeleccionada = this.direcciones[0];
            this.cotizarEnvio();
        } else {
            this.loading = false;
            // Opcional: Redirigir o mostrar un mensaje si no hay direcciones
            console.warn('No hay direcciones registradas.');
            this.router.navigate(['/registrar-direccion']); 
        }
      },
      error: (err) => { // Agregado manejo de error para el log
        console.error('Error al cargar direcciones:', err);
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
      return acc + (Number(precio) * item.quantity); // Asegurarse de que el precio sea numérico
    }, 0);
  }

  cotizarEnvio() {
    if (!this.direccionSeleccionada) {
      console.warn('No hay dirección seleccionada para cotizar envío.');
      return;
    }

    this.cargandoEnvio = true;
    this.costoEnvio = 0; 
    this.diasEntrega = null; // Reiniciar días de entrega también mientras se carga

    this.cartService.quoteShipping(this.direccionSeleccionada.id, this.cartItems)
      .subscribe({
        next: (res) => {
          console.log('🚚 Cotización recibida:', res);

          if (res.manual) {
            this.costoEnvio = 0;
            this.diasEntrega = null;
            this.cargandoEnvio = false;

            alert(res.message || 'El envío será cotizado manualmente. Recibirás el costo por correo.');
            return;
          }

          this.costoEnvio = Number(res.total_envio) || 0; 
          // *** CAMBIO CLAVE AQUÍ: Leer dias_entrega de la respuesta del backend ***
          // Se añade un +3 para el buffer adicional.
          this.diasEntrega = (Number(res.dias_entrega) || 0) + 3; 

          this.cargandoEnvio = false;
        },
        error: (err) => {
          console.error('Error al cotizar envío:', err);
          this.costoEnvio = 0;
          this.diasEntrega = null;
          this.cargandoEnvio = false;
          alert('No se pudo cotizar el envío en este momento. Intenta de nuevo más tarde.');
        }
      });
  }

  confirmarCompra() {
  if (this.costoEnvio === 0 || this.cargandoEnvio || this.cargandoPago) {
    alert('El costo del envío se está calculando o aún no está disponible. Por favor, espera.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('No estás autenticado. Por favor, inicia sesión.');
    this.router.navigate(['/login']);
    return;
  }

  const payload = {
    items: this.cartItems.map(item => {
      const product = item.product || {};
      const imageBaseUrl = 'http://localhost:8000/storage/';
      const imagePath = product.image ? `${imageBaseUrl}${product.image}` : null;

      return {
        id: product.id,
        name: product.name || 'Producto Desconocido',
        quantity: item.quantity,
        unit_price: Number(product.price ?? item.price),
        picture_url: imagePath
      };
    }),
    envio: this.costoEnvio,
    address_id: this.direccionSeleccionada.id
  };

  this.cargandoPago = true; // 🚀 Inicia carga

  this.http.post<any>('http://localhost:8000/api/pago/preferencia', payload, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: (res) => {
      this.cargandoPago = false; // ✅ Termina carga
      if (res.init_point) {
        window.location.href = res.init_point;
      } else {
        alert('Error al redirigir al pago: No se recibió un punto de inicio válido.');
      }
    },
    error: (err) => {
      this.cargandoPago = false; // ❌ Termina carga también en error
      console.error('Ocurrió un error al preparar el pago:', err);
      let errorMessage = 'Ocurrió un error al preparar el pago.';
      if (err.error?.message) {
        errorMessage = err.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      alert(errorMessage);
    }
  });
}


  irANuevaDireccion() {
    this.router.navigate(['/registrar-direccion']);
  }

  getDireccionesVisibles() {
    if (!this.direcciones || this.direcciones.length === 0) {
        return [];
    }
    const primeras = this.direcciones.slice(0, 2);
    if (
        this.direccionSeleccionada &&
        !primeras.some(dir => dir.id === this.direccionSeleccionada.id)
    ) {
        const otherVisible = this.direcciones.find(dir => dir.id !== this.direccionSeleccionada.id);
        return otherVisible ? [this.direccionSeleccionada, otherVisible] : [this.direccionSeleccionada];
    }
    return primeras;
  }
}
