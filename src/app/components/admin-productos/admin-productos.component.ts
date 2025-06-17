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
  productosPorCategoria: { [key: string]: any[] } = {};

  faTrash = faTrash;
  faEdit = faEdit;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  scrollToId: string | null = null;

  constructor(private adminService: AdminService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  // Primero guardamos el scrollToId del query param
  this.route.queryParams.subscribe(params => {
    this.scrollToId = params['scrollTo'] || null;
  });

  // Luego cargamos categorías y productos
  this.cargarCategoriasYProductos();
}

  cargarCategoriasYProductos(): void {
  this.adminService.getCategorias().subscribe(cats => {
    this.categorias = cats;
    this.productosPorCategoria = {};

    let categoriasCargadas = 0;

    cats.forEach(cat => {
      this.adminService.getProductosPorCategoria(cat.id).subscribe(prods => {
        this.productosPorCategoria[cat.id] = prods;
        categoriasCargadas++;

        if (categoriasCargadas === cats.length && this.scrollToId) {
          setTimeout(() => {
            const el = document.getElementById('producto-' + this.scrollToId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            this.scrollToId = null; // limpiamos para no repetir scroll
            if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('highlight');
                  setTimeout(() => {
                    el.classList.remove('highlight');
                  }, 3000); // remueve el resaltado tras 3 segundos
                }
          }, 0);
        }
      });
    });
  }, error => {
    console.error('Error al cargar categorías:', error);
    alert('Error al cargar las categorías.');
  });
}


  editar(id: number) {
    this.router.navigate(['/admin-panel/productos/editar', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar este producto? Esta acción es irreversible.')) {
      this.adminService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado con éxito.');
          this.cargarCategoriasYProductos(); 
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('Error al eliminar el producto. Intenta de nuevo.');
        }
      });
    }
  }

  /**
   * Alterna el estado de un producto entre 'active' y 'paused'.
   * Si el estado actual es 'disabled' o cualquier otro, lo cambiará a 'active'.
   * @param producto El objeto producto a actualizar.
   */
  toggleStatus(producto: any) {
    let newStatus: string;

    if (producto.status === 'active') {
      newStatus = 'paused';
    } else {
      newStatus = 'active'; 
    }

    this.adminService.actualizarEstadoProducto(producto.id, newStatus).subscribe({
      next: (res) => {
        // --- INICIO DE LA CORRECCIÓN CLAVE ---
        // Esto es crucial para depurar y entender la estructura de la respuesta.
        console.log('Respuesta completa de la API para toggleStatus:', res); 

        // Verificar si la respuesta es un objeto y si contiene la propiedad 'message'
        if (res && typeof res === 'object' && 'message' in res) {
          producto.status = newStatus; // Actualiza el estado en el objeto local para la UI
          alert(res.message); // Usa el mensaje del servidor
        } else {
          // Fallback si la estructura de la respuesta es inesperada o no hay 'message'
          producto.status = newStatus; // Aún actualiza el estado localmente
          alert(`Estado de producto actualizado a ${newStatus}. El mensaje de la API no estaba disponible.`);
        }
        // --- FIN DE LA CORRECCIÓN CLAVE ---
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        // Intentar obtener un mensaje de error más específico del objeto de error HTTP
        let errorMessage = 'Error al actualizar el estado del producto. Intenta de nuevo.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        alert(errorMessage);
      }
    });
  }

  scrollIzquierda(categoriaId: number) {
    const contenedor = document.querySelector(`.productos-scroll-container[data-cat-id="${categoriaId}"]`);
    if (contenedor) {
      contenedor.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollDerecha(categoriaId: number) {
    const contenedor = document.querySelector(`.productos-scroll-container[data-cat-id="${categoriaId}"]`);
    if (contenedor) {
      contenedor.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
