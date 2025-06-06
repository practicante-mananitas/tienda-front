import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
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
export class ProductFormComponent {
  product = {
    name: '',
    description: '',
    price: 0,
    category_id: '',
    weight: 0,
    height: 0,
    width: 0,
    length: 0
  };


  categories: any[] = [];
  selectedFile: File | null = null;
  formIntentado = false;
  @Output() productoCreado = new EventEmitter<void>();


  constructor(
    private productService: ProductService, 
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.productService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Error al cargar categorías', err)
    });
    
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

 onSubmit(form: any) {
  this.formIntentado = true;

  if (form.invalid) {
    // 🔥 Marca todos los campos como tocados
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched();
    });

    // ✅ Mostrar alerta
    alert('⚠️ Por favor, completa todos los campos obligatorios.');

    // 🔥 Scroll hacia la alerta visual
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
  formData.append('weight', this.product.weight.toString());
  formData.append('height', this.product.height.toString());
  formData.append('width', this.product.width.toString());
  formData.append('length', this.product.length.toString());

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.productService.createProduct(formData).subscribe({
    next: () => {
      alert('Producto creado correctamente');
      this.productoCreado.emit();
      this.router.navigate(['/admin-panel']);
    },
    error: err => {
      console.error(err);
      alert('Error al crear producto');
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
