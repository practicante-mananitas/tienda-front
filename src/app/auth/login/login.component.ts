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
        // Aquí ya tienes res.token y res.user
        // No necesitas llamar a saveToken porque ya se guarda dentro del servicio en login()

        const redirect = localStorage.getItem('redirectAfterLogin');

        if (redirect && redirect !== '/login') {
          localStorage.removeItem('redirectAfterLogin');
          this.router.navigateByUrl(redirect);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: () => alert('Login incorrecto')
    });
  }
}
