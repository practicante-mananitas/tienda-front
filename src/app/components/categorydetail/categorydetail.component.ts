import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { CategorySliderComponent } from '../category-slider/category-slider.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment'; // <-- Importar environment
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category-detail',
  imports: [CategorySliderComponent, RouterLink, CommonModule],
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.scss'],
  standalone: true
})
export class CategoryDetailComponent implements OnInit {
  category: any;
  subcategories: any[] = [];
  products: any[] = [];
  loading: boolean = true;

  categoryCircleImages: { [key: number]: string } = {};
  subcategoryCircleImages: { [key: number]: string } = {};
  categorySliderImages: string[] = [];

  private scrollIndexMap: { [key: number]: number } = {};

  promos: any[] = [];
  miniBanners: any[] = [];

  mostWanted = [
    { name: 'iPhone 14 Pro', image: 'iphone14.png', discount: 15 },
    { name: 'Smartwatch', image: 'reloj.png', discount: 30 },
    { name: 'Tenis Puma', image: 'tenispuma.png', discount: 15 },
    { name: 'Taladro Bosch', image: 'taladro.png', discount: 20 },
    { name: 'Xbox Series S', image: 'xbox.png', discount: 10 },
    { name: 'Cerveza Tecate', image: 'tecate.png', discount: 20 }
  ];

  promoImagesByCategory: { [key: number]: any[] } = {
    1: [
      { image: 'assets/banner-promo/promo2.png', alt: '10% en moda' },
      { image: 'assets/banner-promo/promo3.png', alt: '15% en deportes' },
      { image: 'assets/banner-promo/promo4.png', alt: '15% en deportes' },
      { image: 'assets/banner-promo/promo5.png', alt: '20% en deportes' }
    ],
    2: [],
    3: []
  };

  miniBannersByCategory: { [key: number]: any[] } = {
    1: [
      { image: 'assets/mini-banners/1.png', alt: 'Inmuebles' },
      { image: 'assets/mini-banners/2.png', alt: 'Vehículos' },
      { image: 'assets/mini-banners/3.png', alt: 'Seguros' },
      { image: 'assets/mini-banners/4.png', alt: 'Viajes' },
      { image: 'assets/mini-banners/5.png', alt: 'Electrónica' }
    ],
    2: [],
    3: []
  };

  sliderImagesByCategory: { [key: number]: string[] } = {
    1: [
      'assets/banners/prueba5.png',
      'assets/banners/prueba6.png',
      'assets/banners/prueba7.png'
    ],
    2: [
      'assets/banners/prueba6.png',
      'assets/banners/cat2-2.png',
      'assets/banners/cat2-3.png'
    ],
    3: []
  };

   storageUrl = environment.storageUrl; // 👈 Aquí guardamos la URL base

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = +params['id'];
      this.loading = true;

      forkJoin({
        category: this.categoryService.getCategory(categoryId),
        subcategories: this.subcategoryService.getByCategory(categoryId),
        products: this.productService.getProductsByCategory(categoryId)
      }).subscribe({
        next: ({ category, subcategories, products }) => {
          this.category = category;
          this.subcategories = subcategories;
          this.products = products;

          this.promos = this.promoImagesByCategory[categoryId] || [];
          this.miniBanners = this.miniBannersByCategory[categoryId] || [];
          this.categorySliderImages = this.sliderImagesByCategory[categoryId] || [];

          this.subcategories.forEach(sub => this.scrollIndexMap[sub.id] = 0);

          this.assignSubcategoryImages();

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error cargando datos:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  assignSubcategoryImages() {
    this.subcategoryCircleImages = {};

    this.subcategories.forEach(subcat => {
      const productos = this.products.filter(p => p.subcategory_id === subcat.id);
      if (productos.length > 0) {
        const rand = Math.floor(Math.random() * productos.length);
        // Aquí uso environment.apiUrl para la base del storage:
        this.subcategoryCircleImages[subcat.id] = `${environment.storageUrl}${productos[rand].image}`;
      } else {
        this.subcategoryCircleImages[subcat.id] = '/assets/categorias/default.png';
      }
    });
  }

  getProductsBySubcategory(subcatId: number) {
    return this.products.filter(p => p.subcategory_id === subcatId);
  }

  scrollToProduct(subcatId: number, index: number) {
    const container = document.querySelector(`.gallery[data-subcategory-id="${subcatId}"]`) as HTMLElement;
    const card = document.getElementById(`product-${subcatId}-${index}`);
    if (container && card) {
      const padding = parseFloat(window.getComputedStyle(container).paddingLeft);
      container.scrollTo({ left: card.offsetLeft - padding, behavior: 'smooth' });
      this.scrollIndexMap[subcatId] = index;
      setTimeout(() => this.cdr.detectChanges(), 300);
    }
  }

  scrollLeft(subcatId: number) {
    const current = this.scrollIndexMap[subcatId] || 0;
    const prev = Math.max(current - 1, 0);
    this.scrollToProduct(subcatId, prev);
  }

  scrollRight(subcatId: number) {
    const productos = this.getProductsBySubcategory(subcatId);
    const current = this.scrollIndexMap[subcatId] || 0;
    const next = Math.min(current + 1, productos.length - 1);
    this.scrollToProduct(subcatId, next);
  }

  isLeftNavDisabled(subcatId: number): boolean {
    const container = document.querySelector(`.gallery[data-subcategory-id="${subcatId}"]`) as HTMLElement;
    return !container || container.scrollLeft <= 5;
  }

  isRightNavDisabled(subcatId: number): boolean {
    const container = document.querySelector(`.gallery[data-subcategory-id="${subcatId}"]`) as HTMLElement;
    return !container || (container.scrollLeft + container.clientWidth + 5) >= container.scrollWidth;
  }

  get showMiniBanners(): boolean {
    return this.subcategories.length > 1 && this.mostWanted.length > 0;
  }

  scrollToCategory(subcategoryId: number) {
    const container = document.querySelector(`.subcategory-section[data-subcategory-id="${subcategoryId}"]`) as HTMLElement;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
