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
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

onLogin() {
  this.authService.login({ email: this.email, password: this.password }).subscribe({
    next: res => {
      this.authService.saveToken(res.access_token);

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
