import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  cartCount$ = new BehaviorSubject<number>(0);
  orderSummary: any = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/cart`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((items) => {
        const total = items.reduce((acc, item) => acc + item.quantity, 0);
        this.cartCount$.next(total);
      })
    );
  }
  

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { product_id: productId, quantity }, {
      headers: this.getAuthHeaders()
    }).pipe(tap(() => this.getCart().subscribe()));
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/remove`, { product_id: productId }, {
      headers: this.getAuthHeaders()
    }).pipe(tap(() => this.getCart().subscribe()));
  }

  clearCart(): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/clear`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(tap(() => this.cartCount$.next(0)));
  }

  finalizeOrder(): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(tap((res: any) => this.orderSummary = res.order));
  }
  
}
