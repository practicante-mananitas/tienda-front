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
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude,
    }).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/login']);
      },
      error: () => alert('Error al registrar')
    });
  }
  
}
