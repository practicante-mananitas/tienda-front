import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.message = 'Te hemos enviado un correo con instrucciones.';
        this.error = '';
      },
      error: () => {
        this.error = 'No pudimos encontrar ese correo.';
        this.message = '';
      }
    });
  }
}
