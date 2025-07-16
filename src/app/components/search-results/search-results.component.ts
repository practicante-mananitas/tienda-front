import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment'; // 👈 ajusta la ruta si es necesario

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  resultados: any[] = [];
  apiUrl = environment.apiUrl; // 👈 Aquí guardamos la URL base
  storageUrl = environment.storageUrl; // 👈 Aquí guardamos la URL base

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const term = params['q']?.toLowerCase() || '';
      this.productService.getProducts().subscribe(products => {
        this.resultados = products.filter((p: any) =>
          p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
      });
    });
  }

  volver() {
    this.location.back();
  }
}
