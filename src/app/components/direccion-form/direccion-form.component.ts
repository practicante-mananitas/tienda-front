import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-direccion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './direccion-form.component.html',
  styleUrl: './direccion-form.component.scss'
})
export class DireccionFormComponent implements OnInit {
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

  estados: any[] = [];
  municipios: any[] = [];
  horas: string[] = [];
  modoEdicion: boolean = false;


  // addressId!: number;
  addressId: number | null = null;


  mostrarExtraInfo = false;
  tipoLugar: string = '';
  soloExtra: boolean = false;

  tiposLugar = [
    { valor: 'casa', label: 'Casa', icono: '🏠' },
    { valor: 'edificio', label: 'Edificio', icono: '🏢' },
    { valor: 'tienda', label: 'Abarrotes', icono: '🏪' },
    { valor: 'otro', label: 'Otro', icono: '🏬' },
  ];

  extraInfo: any = {
    barrio: '',
    nombre_casa: '',
    conserjeria: '',
    hora_apertura: '',
    hora_cierre: '',
    abierto24: false
  };

  dias = [
    { nombre: 'L', seleccionado: false },
    { nombre: 'M', seleccionado: false },
    { nombre: 'X', seleccionado: false },
    { nombre: 'J', seleccionado: false },
    { nombre: 'V', seleccionado: false },
    { nombre: 'S', seleccionado: false },
    { nombre: 'D', seleccionado: false },
  ];

  constructor(private addressService: AddressService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
      this.addressService.getEstados().subscribe({
        next: data => this.estados = data,
        error: err => console.error('Error cargando estados', err)
      });

      // Carga de horas estilo ML
      const bloques = [];
      for (let h = 0; h < 24; h++) {
        bloques.push(`${h.toString().padStart(2, '0')}:00`);
        bloques.push(`${h.toString().padStart(2, '0')}:30`);
      }
      this.horas = bloques;
      //division

     const id = this.route.snapshot.paramMap.get('id');
      if (id) {
      this.mostrarExtraInfo = false; // 👈 agrega esta línea
      this.modoEdicion = true; // ✅ AQUÍ LA PONES
      const addressId = parseInt(id, 10);
      this.addressId = addressId;

      this.addressService.getDireccionCompleta(addressId).subscribe({
      next: (res) => {
        const { address, extra } = res;

        this.direccion = {
          calle: address.calle,
          codigo_postal: address.codigo_postal,
          estado: address.estado,
          municipio: address.municipio,
          localidad: address.localidad,
          colonia: address.colonia,
          numero_interior: address.numero_interior,
          indicaciones_entrega: address.indicaciones_entrega,
          tipo_domicilio: address.tipo_domicilio
        };

        this.addressService.getMunicipiosByEstado(Number(address.estado)).subscribe({
          next: data => this.municipios = data,
          error: err => console.error('Error cargando municipios', err)
        });

        if (extra) {
            if (this.soloExtra) {
              this.mostrarExtraInfo = true; // ✅ solo si vienes de /direccion-extra
            } else {
              this.mostrarExtraInfo = false; // 👈 evita salto automático
            }

            this.tipoLugar = extra.tipo_lugar;
            this.extraInfo = {
              barrio: extra.barrio,
              nombre_casa: extra.nombre_casa,
              conserjeria: extra.conserjeria,
              hora_apertura: extra.hora_apertura,
              hora_cierre: extra.hora_cierre,
              abierto24: extra.abierto24
            };
            this.dias.forEach(d => d.seleccionado = extra.dias?.includes(d.nombre));
          }
      },
      error: (err) => console.error('Error cargando dirección para edición', err)
    });
}

this.route.url.subscribe(segments => {
  const path = segments.map(s => s.path).join('/');
  if (path.startsWith('direccion-extra')) {
    this.soloExtra = true;
  } else {
    this.soloExtra = false;
  }
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
  if (this.modoEdicion && this.addressId) {
    this.addressService.updateAddress(this.addressId, this.direccion).subscribe({
      next: () => {
        console.log('Dirección actualizada');
        this.mostrarExtraInfo = true;
      },
      error: (err) => {
        console.error('Error al actualizar dirección', err);
        alert('Error al actualizar dirección');
      }
    });
  } else {
    this.addressService.createAddress(this.direccion).subscribe({
      next: (response) => {
        this.addressId = response.address.id;
        console.log('Dirección creada:', this.addressId);
        this.mostrarExtraInfo = true;
      },
      error: (err) => {
        console.error('Error al guardar dirección', err);
        alert('Error al guardar dirección');
      }
    });
  }
}


guardarExtra() {
  if (!this.addressId) {
    alert('No se ha generado una dirección válida. Intenta de nuevo.');
    return;
  }

  const datosExtra = {
    address_id: this.addressId,
    tipo_lugar: this.tipoLugar, // ✅ CORRECTO AHORA
    ...this.extraInfo,
    dias: this.dias.filter(d => d.seleccionado).map(d => d.nombre)
  };

  console.log('ENVIANDO A BACKEND:', datosExtra);

  this.addressService.saveDireccionExtra(datosExtra).subscribe({
    next: () => {
      alert('Datos del lugar guardados correctamente');
      this.mostrarExtraInfo = false;
      this.router.navigate(['/mis-direcciones']);
    },
    error: err => {
      console.error('Error al guardar info extra', err);
    }
  });
}


  setNombreCasaSinNombre(event: Event) {
  const input = event.target as HTMLInputElement;
  this.extraInfo.nombre_casa = input.checked ? 'Sin nombre' : '';
}

}
