import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // No está logueado, permite acceso a login/registro
    return true;
  } else {
    // Ya está logueado, redirige a la página principal (o dashboard)
    router.navigate(['/']);
    return false;
  }
};
