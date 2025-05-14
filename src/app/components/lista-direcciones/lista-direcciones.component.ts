import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-direcciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-direcciones.component.html',
  styleUrl: './lista-direcciones.component.scss'
})
export class ListaDireccionesComponent implements OnInit {
  direcciones: any[] = [];
  estados: any[] = [];

  constructor(private addressService: AddressService) {}

ngOnInit(): void {
  this.addressService.getEstados().subscribe({
    next: data => this.estados = data,
    error: err => console.error('Error cargando estados', err)
  });

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


}
