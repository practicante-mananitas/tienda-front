import { Component, OnInit } from '@angular/core';
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
export class DireccionFormComponent implements OnInit{
  direccion = {
    calle: '',
    codigo_postal: '',
    estado: '',
    municipio: '',
    localidad: '',
    colonia: '',
    numero_interior: '',
    indicaciones_entrega: '',
    tipo_domicilio: ''
  };


  // estados = [
  //   'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'CDMX',
  //   'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango',
  //   'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  //   'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  //   'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  //   'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  //   'Yucatán', 'Zacatecas'
  // ];
  estados: any[] = [];
  municipios: any[] = [];


  constructor(private addressService: AddressService, private router: Router) {}

  ngOnInit(): void {
    this.addressService.getEstados().subscribe({
      next: data => this.estados = data,
      error: err => console.error('Error cargando estados', err)
    });
  }

 onEstadoChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  const stateId = Number(select.value);

  this.direccion.estado = stateId.toString();
  this.municipios = [];

  this.addressService.getMunicipiosByEstado(stateId).subscribe({
    next: data => this.municipios = data,
    error: err => console.error('Error cargando municipios', err)
  });
}


  onSubmit(): void {
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
