import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoporteService } from '../../services/soporte.service';


@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.scss']
})
export class SoporteComponent {
  nombre = '';
  correo = '';
  mensaje = '';

  constructor(private soporteService: SoporteService,
    private location: Location    
  ) {}

  enviarConsulta() {
    if (!this.nombre || !this.correo || !this.mensaje) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const consulta = {
      nombre: this.nombre,
      correo: this.correo,
      mensaje: this.mensaje
    };

    this.soporteService.enviarConsulta(consulta).subscribe({
      next: () => {
        alert('Consulta enviada correctamente');
        this.nombre = '';
        this.correo = '';
        this.mensaje = '';
      },
      error: () => alert('Error al enviar la consulta, inténtalo más tarde.')
    });
  }

  volver(): void {
    this.location.back();
  }
}
