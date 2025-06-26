import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private baseUrl = 'http://127.0.0.1:8000/api/favorites';

  constructor(private http: HttpClient) {}

  // Obtener todos los favoritos del usuario autenticado
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Añadir un producto a favoritos
  addFavorite(productId: number): Observable<any> {
    return this.http.post(this.baseUrl, { product_id: productId });
  }

  // Quitar un producto de favoritos
  removeFavorite(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }

  // NUEVO: Consultar si un producto es favorito para el usuario logueado
  isFavorite(productId: number): Observable<boolean> {
    return this.http.get<{ isFavorite: boolean }>(`${this.baseUrl}/check/${productId}`).pipe(
      map(response => response.isFavorite),
      catchError(() => of(false))
    );
  }
}
