import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  sidebarOpen = false;

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user; // 👈 asignas directo el user
      },
      error: () => alert('No autenticado')
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Sesión cerrada correctamente
        this.router.navigate(['/login']);
      },
      error: () => {
        // Aunque falle la petición, limpiamos local y redirigimos
        this.router.navigate(['/login']);
      }
    });
  }

}
