import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  // BehaviorSubject para el conteo total de ítems en el carrito (ya existía)
  cartCount$ = new BehaviorSubject<number>(0);
  
  // NUEVO: BehaviorSubject para la lista REAL de ítems del carrito (consolidados)
  private cartItemsSubject = new BehaviorSubject<any[]>([]);

  orderSummary: any = null;

  constructor(private http: HttpClient, private productService: ProductService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Expone un Observable para que los componentes puedan suscribirse a los cambios
   * en la lista consolidada de ítems del carrito.
   */
  getCartItemsObservable(): Observable<any[]> {
    return this.cartItemsSubject.asObservable();
  }

  /**
   * Obtiene los ítems del carrito desde el backend y los consolida
   * antes de emitirlos a través de cartItemsSubject.
   */
  getCart(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/cart`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((items) => {
        // --- LÓGICA DE CONSOLIDACIÓN DE ÍTEMS DEL CARRITO ---
        const consolidatedItemsMap = new Map<number, any>(); // Mapa para consolidar por product_id

        items.forEach(item => {
          const productId = item.product.id; // Asume que item.product.id es el ID único del producto
          
          if (consolidatedItemsMap.has(productId)) {
            // Si el producto ya está en el mapa, suma la cantidad
            const existingItem = consolidatedItemsMap.get(productId);
            existingItem.quantity += item.quantity;
          } else {
            // Si no está en el mapa, añádelo (copiando el objeto para evitar referencias directas)
            consolidatedItemsMap.set(productId, { ...item });
          }
        });

        // Convierte el mapa de vuelta a un array
        const consolidatedItemsArray = Array.from(consolidatedItemsMap.values());
        
        // Emite el array consolidado a través del BehaviorSubject
        this.cartItemsSubject.next(consolidatedItemsArray);

        // Actualiza también el conteo total de ítems (puede ser la suma de cantidades consolidadas)
        const totalCount = consolidatedItemsArray.reduce((acc, item) => acc + item.quantity, 0);
        this.cartCount$.next(totalCount);
      }),
      catchError(this.handleError)
    );
  }
  
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.productService.getProduct(productId).pipe(
      switchMap(product => {
        if (!product) {
          alert('Error: El producto no pudo ser encontrado.');
          return throwError(() => new Error('Producto no encontrado'));
        }

        const availableStock = product.stock;
        let finalQuantity = quantity;

        if (availableStock <= 0) {
          alert('Este producto está agotado y no puede ser añadido al carrito.');
          return throwError(() => new Error('Producto agotado'));
        }

        if (quantity > availableStock) {
          alert(`Solo quedan ${availableStock} unidades de este producto en stock. Añadiendo ${availableStock} al carrito.`);
          finalQuantity = availableStock;
        }

        if (finalQuantity === 0) {
            return throwError(() => new Error('No se puede añadir 0 unidades al carrito.'));
        }

        // Envía la solicitud al backend
        return this.http.post(`${this.apiUrl}/cart/add`, { product_id: productId, quantity: finalQuantity }, {
          headers: this.getAuthHeaders()
        }).pipe(
          tap(() => this.getCart().subscribe()), // Refresca el carrito después de la adición
          catchError(this.handleError)
        );
      }),
      catchError(this.handleError)
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/remove`, { product_id: productId }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.getCart().subscribe()), // Refresca el carrito después de eliminar
      catchError(this.handleError)
    );
  }

  clearCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/clear`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.getCart().subscribe()), // Refresca el carrito para vaciarlo
      catchError(this.handleError)
    );
  }

  finalizeOrder(): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((res: any) => this.orderSummary = res.order),
      catchError(this.handleError)
    );
  }
  
  quoteShipping(addressId: number, cartItems: any[]) {
    const token = localStorage.getItem('token');
    console.log('🚀 Enviando token JWT:', token);

    return this.http.post<any>(`${this.apiUrl}/shipping/quote`, { // Usa this.apiUrl
      address_id: addressId,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }))
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Ocurrió un error en CartService:', error);
    let errorMessage = 'Algo salió mal; por favor, inténtalo de nuevo más tarde.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
