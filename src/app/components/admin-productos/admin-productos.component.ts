import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  categorias: any[] = [];

  faTrash = faTrash;
  faEdit = faEdit;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  scrollToId: string | null = null;

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.scrollToId = params['scrollTo'] || null;
      const categoryId = params['categoryId'] ? +params['categoryId'] : null;

      this.cargarCategoriasConSubcategorias(categoryId);
    });
  }

  cargarCategoriasConSubcategorias(categoryIdToOpen?: number | null): void {
    this.adminService.getCategoriasConSubcategoriasYProductos().subscribe({
      next: (data) => {
        this.categorias = data.map(cat => {
          cat.subcategories.forEach((subcat: any) => {
            subcat.products.forEach((prod: any) => {
              prod.featuredId = null;
            });
          });
          // Abrir la categoría que coincida con el parámetro
          return { ...cat, abierta: categoryIdToOpen === cat.id };
        });

        // Cargar productos destacados
        this.categorias.forEach(categoria => {
          this.adminService.getFeaturedProductsByCategory(categoria.id).subscribe({
            next: (destacados: any[]) => {
              destacados.forEach(item => {
                const prodId = item.product_id;
                const featuredId = item.id;

                categoria.subcategories.forEach((sub: any) => {
                  sub.products.forEach((p: any) => {
                    if (p.id === prodId) {
                      p.featuredId = featuredId;
                    }
                  });
                });
              });
            },
            error: err => {
              console.error(`Error cargando destacados de categoría ${categoria.name}:`, err);
            }
          });
        });

        // Scroll al producto si se indica
        if (this.scrollToId) {
          setTimeout(() => {
            const el = document.getElementById('producto-' + this.scrollToId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('highlight');
              setTimeout(() => el.classList.remove('highlight'), 3000);
            }
            this.scrollToId = null;
          }, 300);
        }
      },
      error: err => {
        console.error('Error al cargar categorías con subcategorías:', err);
        alert('Error al cargar las categorías.');
      }
    });
  }

  toggleCategoria(categoriaId: number): void {
    this.categorias = this.categorias.map(cat =>
      cat.id === categoriaId ? { ...cat, abierta: !cat.abierta } : cat
    );
  }

  editar(id: number) {
    this.router.navigate(['/admin-panel/productos/editar', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este producto? Esta acción es irreversible.')) {
      this.adminService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado con éxito.');
          this.cargarCategoriasConSubcategorias();
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('Error al eliminar el producto. Intenta de nuevo.');
        }
      });
    }
  }

  toggleStatus(producto: any) {
    let newStatus: string = producto.status === 'active' ? 'paused' : 'active';

    this.adminService.actualizarEstadoProducto(producto.id, newStatus).subscribe({
      next: (res) => {
        if (res && typeof res === 'object' && 'message' in res) {
          producto.status = newStatus;
          alert(res.message);
        } else {
          producto.status = newStatus;
          alert(`Estado de producto actualizado a ${newStatus}.`);
        }
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        let errorMessage = 'Error al actualizar el estado del producto. Intenta de nuevo.';
        if (err.error?.message) errorMessage = err.error.message;
        else if (err.message) errorMessage = err.message;
        alert(errorMessage);
      }
    });
  }

  toggleFeatured(producto: any, categoriaId: number) {
    if (producto.featuredId !== null) {
      // Quitar destacado usando el id del destacado
      this.adminService.eliminarDestacado(producto.featuredId).subscribe({
        next: () => {
          producto.featuredId = null;
          alert('Producto removido de destacados');
        },
        error: (err) => {
          console.error('Error quitando destacado:', err);
          alert('Error al quitar destacado. Intenta de nuevo.');
        }
      });
    } else {
      // Agregar destacado enviando category_id y product_id
      this.adminService.agregarDestacado({ category_id: categoriaId, product_id: producto.id }).subscribe({
        next: (res: any) => {
          producto.featuredId = res.id;
          alert('Producto agregado a destacados');
        },
        error: (err) => {
          console.error('Error agregando destacado:', err);
          alert('Error al agregar destacado. Intenta de nuevo.');
        }
      });
    }
  }

  scrollIzquierdaSub(subId: number) {
    const contenedor = document.querySelector(`.productos-scroll-container[data-sub-id="${subId}"]`);
    if (contenedor) contenedor.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollDerechaSub(subId: number) {
    const contenedor = document.querySelector(`.productos-scroll-container[data-sub-id="${subId}"]`);
    if (contenedor) contenedor.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
