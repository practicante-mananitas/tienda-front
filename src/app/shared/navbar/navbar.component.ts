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

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Cargar categorías para todos
    this.productService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  
    // Solo si está logueado, obtener carrito
    if (this.authService.isLoggedIn()) {
      this.cartService.getCart().subscribe(); // carga inicial
      this.cartService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });
    }
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

}

