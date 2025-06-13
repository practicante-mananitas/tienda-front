import { Component, OnInit, OnDestroy } from '@angular/core'; // Importar OnDestroy
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs'; // Importar Subscription para manejar la suscripción

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy { // Implementar OnDestroy
  cartItems: any[] = [];
  modalAbierto = false;
  hasOutOfStockItems: boolean = false;
  private cartSubscription: Subscription | undefined; // Propiedad para guardar la suscripción

  constructor(
    private cartService: CartService, 
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Suscribirse al Observable de ítems consolidados del carrito desde el servicio
    this.cartSubscription = this.cartService.getCartItemsObservable().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.checkStockAvailability(); // Verificar la disponibilidad de stock cada vez que los ítems cambian
      },
      error: (err) => {
        console.error('Error al cargar ítems consolidados del carrito:', err);
        alert('Error al cargar el carrito');
      }
    });

    // Disparar la carga inicial del carrito.
    // Esto llamará al backend y actualizará el BehaviorSubject en CartService,
    // lo que a su vez actualizará `this.cartItems` a través de la suscripción anterior.
    this.cartService.getCart().subscribe();
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria cuando el componente se destruye
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  /**
   * Verifica si algún producto en el carrito tiene una cantidad mayor a la disponible en stock
   * o si está completamente agotado. Actualiza la bandera `hasOutOfStockItems`.
   * Asume que `item.product.stock` contiene el stock actual disponible del backend.
   */
  checkStockAvailability() {
    this.hasOutOfStockItems = false; // Reinicia la bandera antes de cada verificación

    for (let item of this.cartItems) {
      // Asegurarse de que `item.product` y `item.product.stock` existan
      // Condición: La cantidad en el carrito es mayor que el stock disponible (y el stock es > 0)
      // O: El stock es 0 y el producto está en el carrito (cantidad > 0)
      if (item.product && (
          (item.product.stock !== undefined && item.product.stock !== null && item.quantity > item.product.stock) ||
          (item.product.stock !== undefined && item.product.stock !== null && item.product.stock === 0 && item.quantity > 0)
      )) {
        this.hasOutOfStockItems = true;
        // Si encuentras un solo producto con problemas, no es necesario seguir verificando.
        break; 
      }
    }
  }

  /**
   * Elimina un producto del carrito.
   * El servicio `removeFromCart` ya se encarga de recargar el carrito
   * en el servicio, lo que actualizará automáticamente `this.cartItems` aquí.
   * @param id El ID del producto a eliminar.
   */
  removeItem(id: number) {
    this.cartService.removeFromCart(id).subscribe({
      error: () => alert('Error al eliminar el producto del carrito.')
    });
  }

  /**
   * Vacía todo el carrito.
   * El servicio `clearCart` ya se encarga de recargar el carrito
   * en el servicio, lo que actualizará automáticamente `this.cartItems` aquí.
   */
  clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart().subscribe({
        error: () => alert('Error al vaciar el carrito.')
      });
    }
  }

  /**
   * Calcula el total de la compra.
   * Nota: Este total incluye todos los ítems en el carrito, incluso si tienen problemas de stock.
   * El botón de checkout estará deshabilitado si `hasOutOfStockItems` es true.
   * @returns El total de la compra.
   */
  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      // Asegurarse de que `item.product` y `item.product.price` existan
      const price = item.product?.price ?? item.price; // Usar item.price como fallback si product.price no existe
      return total + (Number(price) * item.quantity);
    }, 0);
  }

  /**
   * Navega de vuelta a la página anterior.
   */
  volver() {
    this.location.back();
  }

  /**
   * Intenta navegar a la página de checkout. Muestra una alerta si hay productos con problemas de stock.
   */
  goToCheckout() {
    if (this.hasOutOfStockItems) {
      alert('Algunos productos en tu carrito tienen una cantidad mayor a la disponible en stock o están agotados. Por favor, ajusta las cantidades o elimínalos antes de finalizar tu pedido.');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  /**
   * Devuelve los primeros 2 ítems para la vista móvil, o todos para la vista de escritorio.
   */
  get visibleItems() {
    return this.isMobile() ? this.cartItems.slice(0, 2) : this.cartItems;
  }

  /**
   * Devuelve los ítems ocultos para la vista móvil.
   */
  get hiddenItems() {
    return this.isMobile() ? this.cartItems.slice(2) : [];
  }

  /**
   * Determina si la vista actual es móvil.
   * @returns True si el ancho de la ventana es menor o igual a 768px.
   */
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  /**
   * Abre el modal de productos y deshabilita el scroll del cuerpo.
   */
  abrirModal() {
    this.modalAbierto = true;
    document.body.style.overflow = 'hidden'; // Evita scroll del fondo
  }

  /**
   * Cierra el modal de productos y habilita el scroll del cuerpo.
   */
  cerrarModal() {
    this.modalAbierto = false;
    document.body.style.overflow = 'auto';
  }
}
