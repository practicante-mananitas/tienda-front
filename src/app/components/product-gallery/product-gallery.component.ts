import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Importa ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SliderComponent } from '../slider/slider.component';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, SliderComponent],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss'
})
export class ProductGalleryComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  products: any[] = [];
  categories: any[] = [];
  highlightSections: any[] = [];
  categoryCircleImages: { [key: number]: string } = {};
  private scrollIndexMap: { [key: number]: number } = {};

  promos = [
    { image: 'assets/banner-promo/promo2.png', alt: '10% en moda' },
    { image: 'assets/banner-promo/promo3.png', alt: '15% en deportes' },
    { image: 'assets/banner-promo/promo4.png', alt: '15% en deportes' },
    { image: 'assets/banner-promo/promo5.png', alt: '20% en deportes' }
  ];

  categorias = [
    { name: 'Gaming', image: 'gaming.png' },
    { name: 'Computadoras', image: 'laptop.png' },
    { name: 'Perfumes', image: 'perfume.png' },
  ];

  mostWanted = [
    { name: 'iPhone 14 Pro', image: 'iphone14.png', discount: 15 },
    { name: 'Smartwatch', image: 'reloj.png', discount: 30 },
    { name: 'Tenis Puma', image: 'tenispuma.png', discount: 15 },
    { name: 'Taladro Bosch', image: 'taladro.png', discount: 20 },
    { name: 'Xbox Series S', image: 'xbox.png', discount: 10 },
    { name: 'Cerveza Tecate', image: 'tecate.png', discount: 20 },
  ];

  miniBanners = [
    { image: 'assets/mini-banners/1.png', alt: 'Inmuebles' },
    { image: 'assets/mini-banners/2.png', alt: 'Vehículos' },
    { image: 'assets/mini-banners/3.png', alt: 'Seguros' },
    { image: 'assets/mini-banners/4.png', alt: 'Viajes' },
    { image: 'assets/mini-banners/5.png', alt: 'Electrónica' }
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // <-- Inyecta ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;

      this.productService.getProducts().subscribe({
        next: products => {
          this.products = products;

          // Initialize scrollIndexMap for each category to 0
          this.categories.forEach(cat => {
            this.scrollIndexMap[cat.id] = 0;
          });

          // Precachear imagen aleatoria para los círculos
          this.categories.forEach(cat => {
            const productos = this.products.filter(p => p.category_id === cat.id);
            if (productos.length > 0) {
              const rand = Math.floor(Math.random() * productos.length);
              this.categoryCircleImages[cat.id] = 'http://127.0.0.1:8000/storage/' + productos[rand].image;
            } else {
              this.categoryCircleImages[cat.id] = '/assets/categorias/default.png';
            }
          });
        },
        error: err => console.error('Error cargando productos', err)
      });
    });

    this.productService.getHighlightSections().subscribe({
      next: data => this.highlightSections = data,
      error: err => console.error('Error cargando secciones destacadas', err)
    });
  }

  /**
   * Desplaza el contenedor del slider a una tarjeta de producto específica
   * para una categoría dada, asegurando que solo el carrusel horizontal se desplace
   * y la ventana principal permanezca en su posición.
   * @param categoryId El ID de la categoría a la que pertenece el producto.
   * @param index El índice del producto dentro de la lista de productos de esa categoría.
   */
  scrollToProduct(categoryId: number, index: number) {
    const container = document.querySelector(`.gallery[data-category-id="${categoryId}"]`) as HTMLElement;
    const card = document.getElementById(`producto-${categoryId}-${index}`);

    if (container && card) {
      const containerPaddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft);
      const targetScrollLeft = card.offsetLeft - containerPaddingLeft;

      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });

      // Always update the index map after a scroll operation
      this.scrollIndexMap[categoryId] = index;

      // Importante: Forzar una detección de cambios después de un pequeño retraso.
      // Esto permite que la animación de scroll termine y la propiedad scrollLeft se actualice
      // antes de que Angular reevalúe las condiciones de deshabilitado de los botones.
      // 400 ms es un buen valor ya que las animaciones "smooth" suelen durar alrededor de 300-500 ms.
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 400); // Ajusta este valor si la animación es más lenta o más rápida
    } else {
      console.warn(`Producto o contenedor no encontrado para categoryId: ${categoryId}, index: ${index}`);
    }
  }

  /**
   * Desplaza el slider de una categoría hacia la derecha (siguiente producto).
   * Calcula el siguiente índice válido y llama a scrollToProduct.
   * @param categoryId El ID de la categoría del slider a desplazar.
   */
  scrollRight(categoryId: number) {
    const productos = this.getProductsByCategory(categoryId);
    const totalProducts = productos.length;

    const currentIndex = this.scrollIndexMap[categoryId] || 0;
    const nextIndex = Math.min(currentIndex + 1, totalProducts - 1);

    if (currentIndex < totalProducts - 1) {
      this.scrollToProduct(categoryId, nextIndex);
    }
    // No else needed here, as the disabled state will prevent clicks at the end
  }

  /**
   * Desplaza el slider de una categoría hacia la izquierda (producto anterior).
   * Calcula el índice anterior válido y llama a scrollToProduct.
   * @param categoryId El ID de la categoría del slider a desplazar.
   */
  scrollLeft(categoryId: number) {
    const currentIndex = this.scrollIndexMap[categoryId] || 0;
    const prevIndex = Math.max(currentIndex - 1, 0);

    if (currentIndex > 0) {
      this.scrollToProduct(categoryId, prevIndex);
    }
    // No else needed here, as the disabled state will prevent clicks at the beginning
  }

  isLeftNavDisabled(categoryId: number): boolean {
  const container = document.querySelector(`.gallery[data-category-id="${categoryId}"]`) as HTMLElement;
  if (!container) return true;

  const hasScrollableContent = container.scrollWidth > container.clientWidth;
  const isAtStart = container.scrollLeft <= 5;

  return !hasScrollableContent || isAtStart;
}

isRightNavDisabled(categoryId: number): boolean {
  const container = document.querySelector(`.gallery[data-category-id="${categoryId}"]`) as HTMLElement;
  if (!container) return true;

  const hasScrollableContent = container.scrollWidth > container.clientWidth;
  const isAtEnd = (container.scrollLeft + container.clientWidth + 5) >= container.scrollWidth;

  return !hasScrollableContent || isAtEnd;
}



  getProductsByCategory(categoryId: number) {
    return this.products.filter(p => p.category_id === categoryId);
  }

  getHighlightSection(index: number): any {
    return this.highlightSections[Math.floor(index / 2)];
  }

  getImageForCategory(categoryId: number): string | null {
    const productos = this.products.filter(p => p.category_id === categoryId);
    if (productos.length === 0) return null;

    const random = Math.floor(Math.random() * productos.length);
    return 'http://127.0.0.1:8000/storage/' + productos[random].image;
  }

  scrollToCategory(categoryId: number) {
    const container = document.querySelector(`.product-section[data-category-id="${categoryId}"]`) as HTMLElement;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
