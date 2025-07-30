import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password = '';
  password_confirmation = '';
  message = '';
  error = '';
  token = '';
  email = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    const data = {
      token: this.token,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.message = 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error.message || 'Hubo un error al restablecer la contraseña.';
        this.message = '';
      }
    });
  }
}
