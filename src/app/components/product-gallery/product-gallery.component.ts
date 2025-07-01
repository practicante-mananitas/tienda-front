import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SliderComponent } from '../slider/slider.component';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, SliderComponent],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss'
})
export class ProductGalleryComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  categories: any[] = [];
  allProducts: any[] = [];
  highlightSections: any[] = [];
  categoryCircleImages: { [key: number]: string } = {};
  private scrollIndexMap: { [key: number]: number } = {};
  featuredProductsByCategory: { [categoryId: number]: any[] } = {};
  loading: boolean = true;

  promos = [
    { image: 'assets/banner-promo/promo2.png', alt: '10% en moda' },
    { image: 'assets/banner-promo/promo3.png', alt: '15% en deportes' },
    { image: 'assets/banner-promo/promo4.png', alt: '15% en deportes' },
    { image: 'assets/banner-promo/promo5.png', alt: '20% en deportes' }
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;

      this.productService.getProducts().subscribe({
        next: (products) => {
          this.allProducts = products;

          this.categories.forEach(cat => {
            const productosDeCategoria = this.allProducts.filter(p => p.category_id === cat.id);

            if (productosDeCategoria.length > 0) {
              const rand = Math.floor(Math.random() * productosDeCategoria.length);
              this.categoryCircleImages[cat.id] = 'http://127.0.0.1:8000/storage/' + productosDeCategoria[rand].image;
            } else {
              this.categoryCircleImages[cat.id] = '/assets/categorias/default.png';
            }

            this.scrollIndexMap[cat.id] = 0;

            this.productService.getFeaturedOnlyProductsByCategory(cat.id).subscribe({
              next: (featuredProducts) => {
                this.featuredProductsByCategory[cat.id] = featuredProducts;
                this.checkIfLoadingIsDone();
              },
              error: () => {
                this.featuredProductsByCategory[cat.id] = [];
                this.checkIfLoadingIsDone();
              }
            });
          });

          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error cargando productos', err);
          this.loading = false;
        }
      });

      this.productService.getHighlightSections().subscribe({
        next: data => {
          this.highlightSections = data;
          this.checkIfLoadingIsDone();
        },
        error: err => {
          console.error('Error cargando secciones destacadas', err);
          this.checkIfLoadingIsDone();
        }
      });
    });
  }

  checkIfLoadingIsDone() {
    const allFeaturedLoaded = Object.keys(this.featuredProductsByCategory).length === this.categories.length;
    const hasHighlights = this.highlightSections.length > 0;
    const hasProducts = this.allProducts.length > 0;

    if (allFeaturedLoaded && hasHighlights && hasProducts) {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  scrollToProduct(categoryId: number, index: number) {
    const container = document.querySelector(`.gallery[data-category-id="${categoryId}"]`) as HTMLElement;
    const card = document.getElementById(`producto-${categoryId}-${index}`);

    if (container && card) {
      const containerPaddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft);
      const targetScrollLeft = card.offsetLeft - containerPaddingLeft;

      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });

      this.scrollIndexMap[categoryId] = index;

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 400);
    } else {
      console.warn(`Producto o contenedor no encontrado para categoryId: ${categoryId}, index: ${index}`);
    }
  }

  scrollRight(categoryId: number) {
    const productos = this.getProductsByCategory(categoryId);
    const totalProducts = productos.length;

    const currentIndex = this.scrollIndexMap[categoryId] || 0;
    const nextIndex = Math.min(currentIndex + 1, totalProducts - 1);

    if (currentIndex < totalProducts - 1) {
      this.scrollToProduct(categoryId, nextIndex);
    }
  }

  scrollLeft(categoryId: number) {
    const currentIndex = this.scrollIndexMap[categoryId] || 0;
    const prevIndex = Math.max(currentIndex - 1, 0);

    if (currentIndex > 0) {
      this.scrollToProduct(categoryId, prevIndex);
    }
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
    return this.featuredProductsByCategory[categoryId] || [];
  }

  getAllProductsByCategory(categoryId: number) {
    return this.allProducts.filter(p => p.category_id === categoryId);
  }

  getHighlightSection(index: number): any {
    return this.highlightSections[Math.floor(index / 2)];
  }

  scrollToCategory(categoryId: number) {
    const container = document.querySelector(`.product-section[data-category-id="${categoryId}"]`) as HTMLElement;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
