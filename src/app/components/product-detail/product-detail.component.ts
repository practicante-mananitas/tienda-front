import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DecimalPipe, NgIf, NgFor, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe, NgIf, NgFor],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  quantity: number = 1;
  isProductOutOfStock: boolean = false; // Indica si el producto está agotado (stock <= 0)
  isProductPaused: boolean = false;    // NUEVO: Indica si el producto está pausado (status === 'paused')
  stockMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.productService.getProduct(Number(productId)).subscribe({
          next: (data) => {
            this.product = data;
            // Al cargar el producto, inicializa las banderas de estado
            this.isProductPaused = this.product.status === 'paused';
            this.isProductOutOfStock = this.product.stock <= 0; // Inicialmente basado en stock real

            // Ajusta la cantidad inicial y el mensaje según el estado principal
            if (this.isProductPaused || this.isProductOutOfStock) {
                this.quantity = 0; // Si está pausado o agotado, la cantidad por defecto es 0
            } else {
                this.quantity = 1; // De lo contrario, la cantidad inicial es 1
            }
            
            this.updateDisplayStatus(); // Actualiza los mensajes y estados de visualización
          },
          error: (err) => {
            console.error('Error al cargar detalles del producto:', err);
            alert('Error al cargar los detalles del producto.');
            this.router.navigate(['/productos']);
          }
        });
      }
    });
  }

  volver(): void {
    this.location.back();
  }

  /**
   * Actualiza los mensajes y el estado general de visualización (habilitación de botones, etc.).
   * La lógica de "pausado" tiene prioridad sobre "agotado".
   */
  updateDisplayStatus(): void {
    if (this.product && typeof this.product.stock === 'number') {
        // La bandera 'isProductPaused' ya debe estar actualizada desde ngOnInit o la recarga
        // Si el producto está pausado, anula la lógica de stock para la compra
        if (this.isProductPaused) {
            this.stockMessage = 'Producto pausado, pronto se reanudará.';
            this.isProductOutOfStock = true; // Tratamos un producto pausado como "agotado para la compra"
            this.quantity = 0; // Aseguramos que la cantidad sea 0
        } else {
            // Si no está pausado, evaluamos el stock real
            this.isProductOutOfStock = this.product.stock <= 0;

            if (this.isProductOutOfStock) {
                this.stockMessage = 'Producto agotado.';
                this.quantity = 0; // Si agotado, cantidad 0
            } else if (this.product.stock > 0 && this.product.stock <= 5) {
                this.stockMessage = `¡Solo quedan ${this.product.stock} en stock!`;
            } else {
                this.stockMessage = `Disponible: ${this.product.stock} unidades.`;
            }

            // Asegurarse de que la cantidad seleccionada no exceda el stock real si no está agotado
            if (!this.isProductOutOfStock && this.quantity > this.product.stock) {
                this.quantity = this.product.stock;
            }
            // Asegurarse de que la cantidad sea al menos 1 si hay stock disponible
            if (!this.isProductOutOfStock && this.quantity === 0) {
                this.quantity = 1;
            }
        }
    } else {
      // Fallback para cuando no hay datos de producto o stock es inválido
      this.isProductOutOfStock = true;
      this.isProductPaused = false; // No puede estar pausado si no hay datos de producto válidos
      this.stockMessage = 'Stock no disponible.';
      this.quantity = 0;
    }
  }

  incrementQuantity(): void {
    // No permitir incrementar si está pausado o agotado
    if (this.isProductPaused || this.isProductOutOfStock) return;

    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    } else if (this.product && this.quantity >= this.product.stock) {
      alert(`No puedes añadir más de ${this.product.stock} unidades. Es todo lo que queda en stock.`);
    }
  }

  decrementQuantity(): void {
    // No permitir decrementar si está pausado o agotado (la cantidad ya debe ser 0)
    if (this.isProductPaused || this.isProductOutOfStock) return;

    if (this.quantity > 1) { // No permitir bajar de 1 si el producto está disponible
      this.quantity--;
    }
  }

  onQuantityChange(event: Event): void {
    // Si está pausado o agotado, no permitir cambiar la cantidad desde el input
    if (this.isProductPaused || this.isProductOutOfStock) {
        (event.target as HTMLInputElement).value = this.quantity.toString(); // Restablecer visualmente el input
        return;
    }

    const inputElement = event.target as HTMLInputElement;
    let newQuantity = Number(inputElement.value);

    // Validar que la cantidad sea un número válido y no sea menor que 1
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    // Asegurarse de que la cantidad no exceda el stock disponible
    if (this.product && newQuantity > this.product.stock) {
      newQuantity = this.product.stock;
      alert(`Solo quedan ${this.product.stock} unidades en stock. Se ha ajustado la cantidad.`);
    }
    
    this.quantity = newQuantity;
    inputElement.value = this.quantity.toString(); // Actualizar el valor del input visualmente
    this.updateDisplayStatus(); // Re-evaluar el mensaje y estado
  }

  agregarAlCarrito(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para continuar.'); // ✅ Muestra el mensaje
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    // No permitir agregar al carrito si el producto está pausado, agotado o la cantidad es 0
    if (!this.product || this.isProductPaused || this.isProductOutOfStock || this.quantity <= 0) {
      alert('No se puede agregar este producto al carrito en este momento.');
      return;
    }

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        alert(`${this.quantity} x "${this.product.name}" añadido(s) al carrito.`);
        // Después de añadir al carrito, es buena práctica volver a cargar los detalles
        // del producto para reflejar el stock actualizado en la UI si el backend lo descuenta.
        this.productService.getProduct(this.product.id).subscribe(data => {
            this.product = data;
            this.updateDisplayStatus(); // Vuelve a actualizar el estado de visualización
        });
      },
      error: (err) => {
        console.error('Error al añadir al carrito:', err);
      }
    });
  }
}
