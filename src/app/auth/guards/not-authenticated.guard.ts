import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async(route, segments) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  console.log({isAuthenticated});

  if ( isAuthenticated ) {
    await router.navigateByUrl('/');
    return false; // no continua
  }

  return true;// continua
};
