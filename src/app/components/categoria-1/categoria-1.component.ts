import { Component, OnInit } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categoria-1',
  imports: [SliderComponent, CommonModule, RouterModule],
  templateUrl: './categoria-1.component.html',
  styleUrl: './categoria-1.component.scss'
})
export class Categoria1Component implements OnInit{
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  products: any[] = [];
  categories: any[] = [];
  categoryId = 1;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: data => this.products = data.filter((p: any) => p.category_id === this.categoryId),
      error: err => console.error('Error cargando productos', err)
    });
  }

  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }
  
  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  getProductsByCategory(categoryId: number) {
    return this.products.filter(p => p.category_id === categoryId);
  }
}
