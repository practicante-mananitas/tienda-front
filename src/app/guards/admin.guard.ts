import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = authService.obtenerUsuario();

  if (token && user && user.role === 'admin') {
    return true;
  } else {
    router.navigate(['/login']); // o a donde quieras redirigir
    return false;
  }
};
