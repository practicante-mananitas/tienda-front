import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/profile']);
      },
      error: () => alert('Error al registrar')
    });
  }
}
