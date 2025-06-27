import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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
  sugerenciasMunicipios: string[] = [];
  todosMunicipios: string[] = [];
  mostrarSugerenciasMunicipios = false;

  sugerenciasCP: string[] = [];
  todosCPs: string[] = [];
  mostrarSugerenciasCP = false;

  todosColonias: string[] = [];
  sugerenciasColonias: string[] = [];
  mostrarSugerenciasColonias = false;

  todosLocalidades: string[] = [];
  sugerenciasLocalidades: string[] = [];
  mostrarSugerenciasLocalidades = false;

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

  constructor(
    private addressService: AddressService, 
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
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

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mostrarExtraInfo = false;
      this.modoEdicion = true;
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

          // Cargar municipios por estado para llenar las listas y sugerencias
          const estadoIdNum = Number(address.estado);
          this.cargarDatosSepomexPorEstado(estadoIdNum);

          if (extra) {
            if (this.soloExtra) {
              this.mostrarExtraInfo = true;
            } else {
              this.mostrarExtraInfo = false;
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
      this.soloExtra = path.startsWith('direccion-extra');
    });
  }

  volver(): void {
    this.location.back();
  }

  cargarDatosSepomexPorEstado(stateId: number) {
    this.addressService.getSepomexPorEstado(stateId).subscribe({
      next: data => {
        const municipiosUnicos = new Set<string>();
        const cpsUnicos = new Set<string>();
        const coloniasUnicas = new Set<string>();
        const localidadesUnicas = new Set<string>();

        data.forEach((entry: any) => {
          municipiosUnicos.add(entry.municipio);
          cpsUnicos.add(entry.cp.toString());
          coloniasUnicas.add(entry.asentamiento);
          localidadesUnicas.add(entry.ciudad);
        });

        this.todosMunicipios = Array.from(municipiosUnicos);
        this.todosCPs = Array.from(cpsUnicos);
        this.todosColonias = Array.from(coloniasUnicas);
        this.todosLocalidades = Array.from(localidadesUnicas);

        // NO llenar sugerencias al inicio para evitar mostrar listas abiertas
        this.sugerenciasMunicipios = [];
        this.sugerenciasCP = [];
        this.sugerenciasColonias = [];
        this.sugerenciasLocalidades = [];

        this.mostrarSugerenciasMunicipios = false;
        this.mostrarSugerenciasCP = false;
        this.mostrarSugerenciasColonias = false;
        this.mostrarSugerenciasLocalidades = false;
      },
      error: err => console.error('Error cargando datos sepomex', err)
    });
  }

  onEstadoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const stateId = Number(select.value);

    this.direccion.estado = stateId.toString();
    this.todosMunicipios = [];
    this.todosCPs = [];
    this.todosColonias = [];
    this.todosLocalidades = [];

    this.cargarDatosSepomexPorEstado(stateId);
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
      tipo_lugar: this.tipoLugar,
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

  filtrarMunicipios(): void {
    if (!this.direccion.municipio) {
      this.sugerenciasMunicipios = [];
      this.mostrarSugerenciasMunicipios = false;
      return;
    }
    const texto = this.direccion.municipio.toLowerCase();
    this.sugerenciasMunicipios = this.todosMunicipios.filter(m =>
      m.toLowerCase().includes(texto)
    ).slice(0, 5);
    this.mostrarSugerenciasMunicipios = this.sugerenciasMunicipios.length > 0;
  }

  seleccionarMunicipio(nombre: string): void {
    this.direccion.municipio = nombre;
    this.sugerenciasMunicipios = [];
    this.mostrarSugerenciasMunicipios = false;
  }

  filtrarCPs(): void {
    if (!this.direccion.codigo_postal) {
      this.sugerenciasCP = [];
      this.mostrarSugerenciasCP = false;
      return;
    }
    const texto = this.direccion.codigo_postal;
    this.sugerenciasCP = this.todosCPs.filter(cp =>
      cp.includes(texto)
    ).slice(0, 5);
    this.mostrarSugerenciasCP = this.sugerenciasCP.length > 0;
  }

  seleccionarCP(cp: string): void {
    this.direccion.codigo_postal = cp;
    this.sugerenciasCP = [];
    this.mostrarSugerenciasCP = false;
  }

  filtrarColonias(): void {
    if (!this.direccion.colonia) {
      this.sugerenciasColonias = [];
      this.mostrarSugerenciasColonias = false;
      return;
    }
    const texto = this.direccion.colonia.toLowerCase();
    this.sugerenciasColonias = this.todosColonias.filter(c =>
      c.toLowerCase().includes(texto)
    ).slice(0, 5);
    this.mostrarSugerenciasColonias = this.sugerenciasColonias.length > 0;
  }

  seleccionarColonia(colonia: string): void {
    this.direccion.colonia = colonia;
    this.sugerenciasColonias = [];
    this.mostrarSugerenciasColonias = false;
  }

  filtrarLocalidades(): void {
    if (!this.direccion.localidad) {
      this.sugerenciasLocalidades = [];
      this.mostrarSugerenciasLocalidades = false;
      return;
    }

    const texto = this.direccion.localidad.toLowerCase();

    this.sugerenciasLocalidades = this.todosLocalidades.filter(loc => {
      if (!loc) return false;
      return loc.toLowerCase().includes(texto);
    }).slice(0, 5);

    this.mostrarSugerenciasLocalidades = this.sugerenciasLocalidades.length > 0;
  }

  seleccionarLocalidad(localidad: string): void {
    this.direccion.localidad = localidad;
    this.sugerenciasLocalidades = [];
    this.mostrarSugerenciasLocalidades = false;
  }
}
