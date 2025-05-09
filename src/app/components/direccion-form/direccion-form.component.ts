import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-direccion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './direccion-form.component.html',
  styleUrl: './direccion-form.component.scss'
})
export class DireccionFormComponent {
  direccion = {
    street: '',
    postal_code: '',
    state: '',
    municipio: '',
    localidad: '',
    colonia: '',
    interior: '',
    indicaciones: '',
    tipo: ''
  };

  estados = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'CDMX',
    'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango',
    'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
    'Yucatán', 'Zacatecas'
  ];

  constructor(private addressService: AddressService, private router: Router) {}

  onSubmit() {
    this.addressService.createAddress(this.direccion).subscribe({
      next: () => {
        alert('Dirección guardada correctamente');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al guardar dirección');
      }
    });
  }
}
