import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  productos: any[] = [];
  topVendidos: number[] = [];
  recomendados: number[] = [];
  ofertas: number[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getProductos().subscribe((res) => this.productos = res);

    this.adminService.getHighlightSections().subscribe((res: any[]) => {
      this.topVendidos = res.find(s => s.slug === 'top-vendidos')?.productos.map((p: any) => p.id) || [];
      this.recomendados = res.find(s => s.slug === 'recomendados')?.productos.map((p: any) => p.id) || [];
      this.ofertas = res.find(s => s.slug === 'ofertas')?.productos.map((p: any) => p.id) || [];
    });
  }

  guardar() {
    this.adminService.syncSecciones({
      top_vendidos: this.topVendidos,
      recomendados: this.recomendados,
      ofertas: this.ofertas,
    }).subscribe(() => alert('¡Secciones actualizadas con éxito!'));
  }
}
