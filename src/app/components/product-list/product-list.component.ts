import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment'; // 👈 ajusta la ruta si es necesario

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  apiUrl = environment.apiUrl;
  storageUrl = environment.storageUrl;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: res => this.products = res,
      error: err => {
        console.error('Error cargando productos', err);
        alert('No autorizado o sesión expirada');
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado');
          this.products = this.products.filter(p => p.id !== id); // actualiza la lista
        },
        error: () => alert('Error al eliminar')
      });
    }
  }
  
}
