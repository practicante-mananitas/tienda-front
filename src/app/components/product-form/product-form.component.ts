import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: 0,
    category_id: '',
    subcategory_id: '', // <--- NUEVO: propiedad para la subcategoría
    weight: 0,
    height: 0,
    width: 0,
    length: 0,
    stock: 0
  };

  categories: any[] = [];
  subcategories: any[] = [];
  galleryFiles: File[] = [];
  selectedFile: File | null = null;
  formIntentado = false;
  @Output() productoCreado = new EventEmitter<void>();

  constructor(
    private productService: ProductService,
    private subcategoryService: SubcategoryService,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  onGalleryChange(event: any) {
    this.galleryFiles = Array.from(event.target.files);
  }

  onCategoryChange(categoryId: number) {
    this.product.subcategory_id = ''; // limpiar subcategoría
    this.subcategoryService.getByCategory(categoryId).subscribe({
      next: (subs) => this.subcategories = subs,
      error: (err) => console.error('Error al cargar subcategorías', err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onSubmit(form: NgForm) {
    this.formIntentado = true;

    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });

      alert('⚠️ Por favor, completa todos los campos obligatorios correctamente.');

      setTimeout(() => {
        const warning = document.querySelector('.form-warning');
        if (warning) {
          warning.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      return;
    }

    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id);
    formData.append('subcategory_id', this.product.subcategory_id); // <--- Añadir subcategoría
    formData.append('weight', this.product.weight.toString());
    formData.append('height', this.product.height.toString());
    formData.append('width', this.product.width.toString());
    formData.append('length', this.product.length.toString());
    formData.append('stock', this.product.stock.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.galleryFiles.forEach(file => {
      formData.append('gallery[]', file);
    });

    this.productService.createProduct(formData).subscribe({
      next: () => {
        alert('Producto creado correctamente');
        this.productoCreado.emit();
        this.router.navigate(['/admin-panel']);
      },
      error: err => {
        console.error('Error al crear producto:', err);
        alert('Error al crear producto. Revisa la consola para más detalles.');
      }
    });
  }

  volverAlPanel() {
    this.router.navigate(['/admin-panel']);
  }

  get pesoVolumetrico(): number {
    const { height, width, length } = this.product;
    if (!height || !width || !length) return 0;
    return +(height * width * length / 5000).toFixed(2);
  }

  get pesoFacturable(): number {
    const volumetrico = this.pesoVolumetrico;
    const real = this.product.weight || 0;
    return +(Math.max(real, volumetrico)).toFixed(2);
  }
}
