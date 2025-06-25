import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista-direcciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-direcciones.component.html',
  styleUrls: ['./lista-direcciones.component.scss']
})
export class ListaDireccionesComponent implements OnInit {
  direcciones: any[] = [];
  estados: any[] = [];

  constructor(
    private addressService: AddressService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.cargarEstados();
    this.cargarDirecciones();
  }

  cargarEstados() {
    this.addressService.getEstados().subscribe({
      next: data => this.estados = data,
      error: err => console.error('Error cargando estados', err)
    });
  }

  cargarDirecciones() {
    this.addressService.getMyAddress().subscribe({
      next: data => {
        this.direcciones = Array.isArray(data) ? data : [data];
      },
      error: err => console.error('Error al obtener direcciones', err)
    });
  }

  getNombreEstado(id: number): string {
    const estado = this.estados.find(e => e.id == id);
    return estado ? estado.name : `ID ${id}`;
  }

  volver() {
    this.location.back();
  }

  eliminarDireccion(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      this.addressService.deleteAddress(id).subscribe({
        next: () => {
          // Actualizar la lista sin la dirección eliminada
          this.direcciones = this.direcciones.filter(dir => dir.id !== id);
          alert('Dirección eliminada correctamente.');
        },
        error: err => {
          console.error('Error eliminando dirección', err);
          alert('Ocurrió un error al eliminar la dirección.');
        }
      });
    }
  }
}
