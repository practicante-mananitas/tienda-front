import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // tu URL base

  constructor(private http: HttpClient) {}

  // Obtener todas las subcategorías de una categoría
  getByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subcategories/category/${categoryId}`);
  }
}
