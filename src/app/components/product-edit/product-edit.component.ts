import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { environment } from '../../../environments/environment'; // 👈 ajusta la ruta si es necesario

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  product: any = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category_id: null,
    subcategory_id: null,
    weight: null,
    height: null,
    width: null,
    length: null,
    stock: 0
  };

  categories: any[] = [];
  subcategories: any[] = [];
  gallery: any[] = [];       // Imágenes actuales de la galería
  galleryFiles: File[] = []; // Nuevas imágenes para subir
  selectedFile: File | null = null; // Imagen principal nueva
  productId: number = 0;
  apiUrl = environment.apiUrl; // 👈 Aquí guardamos la URL base
  storageUrl = environment.storageUrl; // 👈 Aquí guardamos la URL base

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private subcategoryService: SubcategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    // Obtener producto con galería incluida
    this.productService.getProduct(this.productId).subscribe({
      next: data => {
        this.product = data;
        this.gallery = data.images || [];

        if (this.product.stock === null || typeof this.product.stock === 'undefined') {
          this.product.stock = 0;
        }

        if (this.product.category_id) {
          this.loadSubcategories(this.product.category_id);
        }
      },
      error: () => alert('Producto no encontrado')
    });

    // Cargar categorías
    this.productService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: () => alert('Error al cargar categorías')
    });
  }

  eliminarImagenGaleria(id: number) {
    if (confirm('¿Seguro que quieres eliminar esta imagen?')) {
      this.productService.deleteGalleryImage(id).subscribe({
        next: () => {
          this.gallery = this.gallery.filter(img => img.id !== id);
        },
        error: err => {
          console.error('Error al eliminar imagen:', err);
          alert('Error al eliminar la imagen.');
        }
      });
    }
  }

  loadSubcategories(categoryId: number) {
    this.subcategoryService.getByCategory(categoryId).subscribe({
      next: res => this.subcategories = res,
      error: err => console.error('Error al cargar subcategorías:', err)
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.product.category_id = +value;
    this.product.subcategory_id = null;
    this.loadSubcategories(this.product.category_id);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onGalleryChange(event: any) {
    this.galleryFiles = Array.from(event.target.files);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id);
    formData.append('subcategory_id', this.product.subcategory_id);
    formData.append('stock', this.product.stock.toString());

    formData.append('weight', this.product.weight?.toString() || '');
    formData.append('height', this.product.height?.toString() || '');
    formData.append('width', this.product.width?.toString() || '');
    formData.append('length', this.product.length?.toString() || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.galleryFiles.forEach(file => {
      formData.append('gallery[]', file);
    });

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        alert('Producto actualizado');
        this.router.navigate(['/admin-panel/productos']);
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        alert('Error al actualizar producto. Revisa la consola para más detalles.');
      }
    });
  }

  get pesoVolumetrico(): number {
    const { height, width, length } = this.product;
    if (!height || !width || !length) return 0;
    return +(height * width * length / 5000).toFixed(2);
  }

  get pesoFacturable(): number {
    const real = this.product.weight || 0;
    const volumetrico = this.pesoVolumetrico;
    return Math.max(real, volumetrico);
  }
}
