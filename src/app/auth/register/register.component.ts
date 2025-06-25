import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  phone = '';
  address = '';
  email = '';
  password = ''; 
  latitude: number = 0;
  longitude: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    }, (error) => {
      console.error('No se pudo obtener la ubicación', error);
    });
  }
  
  onRegister() {
    if (!this.esPasswordValida(this.password)) {
      alert('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.');
      return;
    }

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      latitude: this.latitude,
      longitude: this.longitude,
    }).subscribe({
      next: res => {
        // No guardamos token porque el usuario no está verificado
        this.router.navigate(['/verify-email']);
      },
      error: err => {
        const msg = err.error?.message || err.error?.errors?.password?.[0] || 'Error al registrar';
        alert(msg);
      }
    });
  }


  esPasswordValida(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  
}
