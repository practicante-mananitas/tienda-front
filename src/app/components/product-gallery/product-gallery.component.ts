import { Component, OnInit } from '@angular/core';
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
  categoryCircleImages: { [key: number]: string } = {}; // ← Agrega arriba

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




  // scrollLeft() {
  //   this.scrollContainer.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
  // }

  // scrollRight() {
  //   this.scrollContainer.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
  // }
  constructor(private productService: ProductService, private route: ActivatedRoute) {}

 ngOnInit(): void {
  this.productService.getCategories().subscribe(categories => {
    this.categories = categories;

    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;

        // ✅ Precachear imagen aleatoria para los círculos
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
  scrollLeft(categoryId: number) {
    const container = document.querySelector(`.gallery[data-category-id="${categoryId}"]`) as HTMLElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }
  
  scrollRight(categoryId: number) {
    const container = document.querySelector(`.gallery[data-category-id="${categoryId}"]`) as HTMLElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
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
 