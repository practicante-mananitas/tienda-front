import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // CORREGIDO: styleUrls en plural
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        const redirect = localStorage.getItem('redirectAfterLogin');
        const usuario = res.user;

        if (redirect && redirect !== '/login') {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigateByUrl(redirect);
        } else if (usuario.role === 'admin') {
          this.router.navigate(['/admin-panel']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        if (err.status === 403 && err.error?.message) {
          alert(err.error.message);  // <-- Muestra el mensaje de "Debes verificar tu correo..."
        } else {
          alert('Login incorrecto');
        }
      }
    });
  }

}
