import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  categorias: any[] = [];
  productosPorCategoria: { [key: string]: any[] } = {};

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.adminService.getCategorias().subscribe(cats => {
      this.categorias = cats;

      cats.forEach(cat => {
        this.adminService.getProductosPorCategoria(cat.id).subscribe(prods => {
          this.productosPorCategoria[cat.id] = prods;
        });
      });
    });
  }

  editar(id: number) {
    this.router.navigate(['/admin-panel/productos/editar', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.adminService.eliminarProducto(id).subscribe(() => {
        // Opcional: recargar
        this.ngOnInit();
      });
    }
  }

  toggleActivo(producto: any) {
    producto.activo = !producto.activo;
    this.adminService.actualizarEstadoProducto(producto.id, producto.activo).subscribe();
  }

  scrollIzquierda(categoriaId: number) {
  const contenedor = document.querySelector(`.productos-grid[data-cat-id="${categoriaId}"]`);
  contenedor?.scrollBy({ left: -300, behavior: 'smooth' });
}

scrollDerecha(categoriaId: number) {
  const contenedor = document.querySelector(`.productos-grid[data-cat-id="${categoriaId}"]`);
  contenedor?.scrollBy({ left: 300, behavior: 'smooth' });
}

}
