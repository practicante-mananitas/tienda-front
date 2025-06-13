import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

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
    weight: null,
    height: null,
    width: null,
    length: null,
    stock: 0 // <--- NUEVO: Inicializa el stock
  };

  categories: any[] = [];
  selectedFile: File | null = null;
  productId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
  
    // Obtener datos del producto
    this.productService.getProduct(this.productId).subscribe({
      next: data => {
        this.product = data;
        // Asegurarse de que el stock se inicialice correctamente si es null o undefined desde la API
        if (typeof this.product.stock === 'undefined' || this.product.stock === null) {
          this.product.stock = 0; 
        }
      },
      error: () => alert('Producto no encontrado')
    });
  
    // Obtener categorías
    this.productService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: () => alert('Error al cargar categorías')
    });
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category_id', this.product.category_id);
    formData.append('stock', this.product.stock.toString()); // <--- NUEVO: Añadir el stock al FormData

    formData.append('weight', this.product.weight?.toString() || '');
    formData.append('height', this.product.height?.toString() || '');
    formData.append('width', this.product.width?.toString() || '');
    formData.append('length', this.product.length?.toString() || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

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
