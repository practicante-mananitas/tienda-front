import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  searchTerm: string = '';
  showProfileMenu = false;
  showCategoryMenu = false;
  menuAbierto = false;
  categories: any[] = [];
  showSearch = false;
  isMobile = false;

  private cartCountSub?: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Cargar categorías siempre
    this.productService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });

    const token = localStorage.getItem('token');

    if (!token) {
      // Usuario invitado: no cargamos carrito ni sesión
      return;
    }

    this.authService.checkSession().subscribe((isValid) => {
      if (isValid) {
        this.cartService.getCart().subscribe(() => {
          // Luego de cargar carrito, suscribimos para actualizar contador
          this.cartCountSub = this.cartService.cartCount$.subscribe(count => {
            this.cartCount = count;
          });
        });
      } else {
        this.logout();
      }
    }, error => {
      console.warn('Error al validar sesión:', error);
    });

    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
  }

  ngOnDestroy(): void {
    if (this.cartCountSub) {
      this.cartCountSub.unsubscribe();
    }
    window.removeEventListener('resize', this.checkIfMobile.bind(this));
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.cartCount = 0;
        if (this.cartCountSub) {
          this.cartCountSub.unsubscribe();
          this.cartCountSub = undefined;
        }
        this.router.navigate(['/login']);
      },
      error: () => {
        this.cartCount = 0;
        if (this.cartCountSub) {
          this.cartCountSub.unsubscribe();
          this.cartCountSub = undefined;
        }
        this.authService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }

  buscar() {
    const query = this.searchTerm.trim();
    if (query) {
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
      this.searchTerm = '';
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    setTimeout(() => this.showProfileMenu = false, 150);
  }

  toggleCategoryMenu() {
    this.showCategoryMenu = !this.showCategoryMenu;
  }

  closeCategoryMenu() {
    setTimeout(() => this.showCategoryMenu = false, 150);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  irAlCarrito() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/carrito']);
    } else {
      localStorage.setItem('redirectAfterLogin', '/carrito');
      if (confirm('Debes iniciar sesión para acceder al carrito. ¿Deseas iniciar sesión ahora?')) {
        this.router.navigate(['/login']);
      }
    }
  }

  hasProfileOptions(): boolean {
    return this.authService.isLoggedIn() || !this.authService.isLoggedIn();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isGuest() {
    return !this.authService.isLoggedIn();
  }

  toggleSearch() {
    if (this.isMobile) {
      this.showSearch = !this.showSearch;
    }
  }
}
