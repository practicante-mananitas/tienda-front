import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DecimalPipe, NgIf, NgFor, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { environment } from '../../../environments/environment'; // 👈 ajusta la ruta si es necesario

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
  isProductOutOfStock: boolean = false;
  isProductPaused: boolean = false;
  stockMessage: string = '';
  selectedImage: string = '';
  isFavorite: boolean = false;
  review = {
    rating: 0,
    comment: ''
  };
  reviews: any[] = [];
  reviewError: string = '';  // <-- propiedad para mostrar error en el formulario de review
  apiUrl = environment.apiUrl; // 👈 Aquí guardamos la URL base
  storageUrl = environment.storageUrl; // 👈 Aquí guardamos la URL base

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService, // público para usar en template
    private favoriteService: FavoriteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.productService.getProduct(Number(productId)).subscribe({
          next: (data) => {
            this.product = data;
            this.loadReviews();

            this.selectedImage = this.product.image;

            this.isProductPaused = this.product.status === 'paused';
            this.isProductOutOfStock = this.product.stock <= 0;
            this.quantity = (this.isProductPaused || this.isProductOutOfStock) ? 0 : 1;
            this.updateDisplayStatus();

            if (this.authService.isLoggedIn()) {
              this.favoriteService.isFavorite(this.product.id).subscribe({
                next: (isFav: boolean) => {
                  this.isFavorite = isFav;
                },
                error: () => {
                  this.isFavorite = false;
                }
              });
            } else {
              this.isFavorite = false;
            }
          },
          error: () => {
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

  updateDisplayStatus(): void {
    if (this.product && typeof this.product.stock === 'number') {
      if (this.isProductPaused) {
        this.stockMessage = 'Producto pausado, pronto se reanudará.';
        this.isProductOutOfStock = true;
        this.quantity = 0;
      } else {
        this.isProductOutOfStock = this.product.stock <= 0;

        if (this.isProductOutOfStock) {
          this.stockMessage = 'Producto agotado.';
          this.quantity = 0;
        } else if (this.product.stock <= 5) {
          this.stockMessage = `¡Solo quedan ${this.product.stock} en stock!`;
        } else {
          this.stockMessage = `Disponible: ${this.product.stock} unidades.`;
        }

        if (!this.isProductOutOfStock && this.quantity > this.product.stock) {
          this.quantity = this.product.stock;
        }

        if (!this.isProductOutOfStock && this.quantity === 0) {
          this.quantity = 1;
        }
      }
    } else {
      this.isProductOutOfStock = true;
      this.isProductPaused = false;
      this.stockMessage = 'Stock no disponible.';
      this.quantity = 0;
    }
  }

  incrementQuantity(): void {
    if (this.isProductPaused || this.isProductOutOfStock) return;
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    } else {
      alert(`No puedes añadir más de ${this.product.stock} unidades.`);
    }
  }

  decrementQuantity(): void {
    if (this.isProductPaused || this.isProductOutOfStock) return;
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange(event: Event): void {
    if (this.isProductPaused || this.isProductOutOfStock) {
      (event.target as HTMLInputElement).value = this.quantity.toString();
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    let newQuantity = Number(inputElement.value);

    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    if (this.product && newQuantity > this.product.stock) {
      newQuantity = this.product.stock;
      alert(`Solo quedan ${this.product.stock} unidades.`);
    }

    this.quantity = newQuantity;
    inputElement.value = this.quantity.toString();
    this.updateDisplayStatus();
  }

  agregarAlCarrito(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para continuar.');
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product || this.isProductPaused || this.isProductOutOfStock || this.quantity <= 0) {
      alert('No se puede agregar este producto al carrito.');
      return;
    }

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        alert(`${this.quantity} x "${this.product.name}" añadido(s) al carrito.`);
        this.productService.getProduct(this.product.id).subscribe(data => {
          this.product = data;
          this.updateDisplayStatus();
        });
      },
      error: (err) => {
        console.error('Error al añadir al carrito:', err);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para guardar productos como favoritos.');
      return;
    }

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(this.product.id).subscribe({
        next: () => this.isFavorite = false,
        error: () => alert('No se pudo quitar de favoritos.')
      });
    } else {
      this.favoriteService.addFavorite(this.product.id).subscribe({
        next: () => this.isFavorite = true,
        error: () => alert('No se pudo añadir a favoritos.')
      });
    }
  }

  setRating(stars: number): void {
    this.review.rating = stars;
  }

  loadReviews(): void {
    if (!this.product?.id) return;

    this.productService.getReviews(this.product.id).subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
      }
    });
  }

  submitReview(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para comentar.');
      return;
    }

    const payload = { ...this.review };

    this.productService.addReview(this.product.id, payload).subscribe({
      next: () => {
        this.review = { rating: 0, comment: '' };
        this.reviewError = '';
        this.loadReviews();
      },
      error: (err) => {
        if (err.error?.errors?.rating) {
          // Mensaje en español personalizado:
          this.reviewError = 'La calificación debe ser al menos 1.';
        } else if (err.error?.message) {
          this.reviewError = err.error.message;
        } else {
          this.reviewError = 'No se pudo enviar tu comentario.';
        }
      }
    });
  }
}
