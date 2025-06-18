import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeguridadService } from '../../services/seguridad.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.scss']
})
export class SeguridadComponent implements OnInit {
  passwordForm!: FormGroup;
  mensaje = '';
  error = '';
  actividades: any[] = [];
  errorActividad = '';

  sesionesActivas: any[] = [];
  errorSesiones = '';

  sessionIdActual: number | null = null;

  constructor(
    private fb: FormBuilder,
    private seguridadService: SeguridadService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarActividad();
    this.cargarSesionesActivas();

    // ✅ Leer el session_id del localStorage
    const storedId = localStorage.getItem('session_id');
    this.sessionIdActual = storedId ? parseInt(storedId, 10) : null;
  }

  initForm() {
    this.passwordForm = this.fb.group({
      password_actual: ['', Validators.required],
      nueva_password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      nueva_password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('nueva_password')?.value;
    const confirm = group.get('nueva_password_confirmation')?.value;
    return pass === confirm ? null : { noMatch: true };
  }

  cambiarContrasena() {
    this.mensaje = '';
    this.error = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.seguridadService.cambiarContrasena(this.passwordForm.value).subscribe({
      next: res => this.mensaje = res.mensaje,
      error: err => this.error = err.error?.error || 'Error al cambiar contraseña'
    });
  }

  cargarActividad() {
    this.seguridadService.actividadReciente().subscribe({
      next: data => this.actividades = data,
      error: () => this.errorActividad = 'No se pudo cargar la actividad reciente.'
    });
  }

  cargarSesionesActivas() {
    this.seguridadService.obtenerSesionesActivas().subscribe({
      next: data => this.sesionesActivas = data,
      error: () => this.errorSesiones = 'No se pudo cargar las sesiones activas.'
    });
  }

  cerrarSesion(idSesion: number) {
    this.seguridadService.cerrarSesion(idSesion).subscribe({
      next: () => this.cargarSesionesActivas(),
      error: () => this.errorSesiones = 'No se pudo cerrar la sesión.'
    });
  }

  esSesionActual(id: number): boolean {
    return this.sessionIdActual === id;
  }

    volver() {
    this.location.back();
  }
}
