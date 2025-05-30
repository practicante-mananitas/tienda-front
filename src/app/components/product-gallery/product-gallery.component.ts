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

  promos = [
  { image: 'assets/banner-promo/promo2.png', alt: '10% en moda' },
  { image: 'assets/banner-promo/promo3.png', alt: '15% en deportes' },
  { image: 'assets/banner-promo/promo4.png', alt: '15% en deportes' }
  ];


  // scrollLeft() {
  //   this.scrollContainer.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
  // }

  // scrollRight() {
  //   this.scrollContainer.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
  // }
  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(data => this.categories = data);
    this.productService.getProducts().subscribe({
      next: data => this.products = data,
      error: err => console.error('Error cargando productos', err)
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
  
}
 