import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { SliderComponent } from '../slider/slider.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  imports: [SliderComponent, RouterLink, CommonModule],
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.scss'],
  standalone: true
})
export class CategoryDetailComponent implements OnInit {
  category: any;
  subcategories: any[] = [];
  products: any[] = [];

  private scrollIndexMap: { [key: number]: number } = {};

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
    { name: 'Cerveza Tecate', image: 'tecate.png', discount: 20 }
  ];

  miniBanners = [
    { image: 'assets/mini-banners/1.png', alt: 'Inmuebles' },
    { image: 'assets/mini-banners/2.png', alt: 'Vehículos' },
    { image: 'assets/mini-banners/3.png', alt: 'Seguros' },
    { image: 'assets/mini-banners/4.png', alt: 'Viajes' },
    { image: 'assets/mini-banners/5.png', alt: 'Electrónica' }
  ];

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
      this.loadCategory(categoryId);
      this.loadSubcategories(categoryId);
      this.loadProducts(categoryId);
    });
  }

  loadCategory(id: number) {
    this.categoryService.getCategory(id).subscribe(cat => this.category = cat);
  }

  loadSubcategories(categoryId: number) {
    this.subcategoryService.getByCategory(categoryId).subscribe(subcats => {
      this.subcategories = subcats;
      subcats.forEach(sub => {
        this.scrollIndexMap[sub.id] = 0;
      });
    });
  }

  loadProducts(categoryId: number) {
    this.productService.getProductsByCategory(categoryId).subscribe(products => {
      this.products = products;
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
    // Mostrar solo si hay al menos 2 subcategorías y mostWanted no está vacío
    return this.subcategories.length > 1 && this.mostWanted.length > 0;
  }

}
