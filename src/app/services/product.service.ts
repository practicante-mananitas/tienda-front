import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, {
      headers: this.getAuthHeaders()
    });
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createProduct(product: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product, {
      headers: this.getAuthHeaders()
    });
  }

  updateProduct(id: number, product: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${id}?_method=PUT`, product, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getProductsByCategory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/category/${id}`);
  }

  getHighlightSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/highlight-sections`);
  }

  deleteGalleryImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gallery-images/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getFeaturedOnlyProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/${categoryId}/featured-only-products`);
  }

  getReviews(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/${productId}/reviews`);
  }

  addReview(productId: number, payload: { rating: number; comment?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/reviews`, payload, {
      headers: this.getAuthHeaders()
    });
  }
}
