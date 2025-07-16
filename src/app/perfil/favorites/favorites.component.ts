import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  storageUrl = environment.storageUrl; // 👈 Aquí guardamos la URL base
  

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (favs) => {
        this.favorites = favs;
        console.log('Favoritos recibidos:', this.favorites);
      },
      error: err => {
        console.error('Error al cargar favoritos:', err);
      }
    });
  }

  irADetalle(productId: number): void {
    this.router.navigate(['/tienda', productId]);
  }

  onKeyDown(event: KeyboardEvent, productId: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.irADetalle(productId);
    }
  }

  irATienda() {
    // Navega a la página principal o de productos
    this.router.navigate(['/tienda']); // cambia '/tienda' por tu ruta real
  }

  volver(): void {
    this.location.back();
  }
}
