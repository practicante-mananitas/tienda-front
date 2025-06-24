import { Component, NgModule, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  searchTerm: string = '';
  showProfileMenu = false;
  showCategoryMenu = false;
  menuAbierto = false;
  categories: any[] = [];
  showSearch = false;
  isMobile = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {}

ngOnInit(): void {
  // 🔄 Cargar categorías SIEMPRE, incluso si no hay token
  this.productService.getCategories().subscribe({
    next: (res) => this.categories = res,
    error: (err) => console.error('Error al cargar categorías', err)
  });

  const token = localStorage.getItem('token');

  if (!token) {
    // Usuario invitado: no cargamos carrito ni sesión, pero ya cargamos categorías arriba
    return;
  }

  this.authService.checkSession().subscribe((isValid) => {
    if (isValid) {
      this.cartService.getCart().subscribe();
      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });
    } else {
      this.authService.logout();
    }
  }, error => {
    console.warn('Error al validar sesión:', error);
  });

  this.checkIfMobile();
  window.addEventListener('resize', this.checkIfMobile.bind(this));
}


  
  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
    setTimeout(() => this.showProfileMenu = false, 150); // espera breve para permitir click
  }

  toggleCategoryMenu() {
    this.showCategoryMenu = !this.showCategoryMenu;
  }

  closeCategoryMenu() {
    setTimeout(() => this.showCategoryMenu = false, 150); // espera breve para permitir click
  }

  
toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}

irAlCarrito() {
  if (this.authService.isLoggedIn()) {
    this.router.navigate(['/carrito']);
  } else {
    // Guarda la intención en localStorage
    localStorage.setItem('redirectAfterLogin', '/carrito');

    // (Opcional) Muestra mensaje de confirmación
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

