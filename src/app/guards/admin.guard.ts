import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.obtenerUsuario(); // debe retornar el usuario con el campo role

  if (user && user.role === 'admin') {
    return true;
  } else {
    router.navigate(['/']); // redirige a inicio si no es admin
    return false;
  }
};
