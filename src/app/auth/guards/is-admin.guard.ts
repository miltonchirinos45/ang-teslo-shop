import type { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';

export const isAdminGuard: CanMatchFn = async (route, segments) => {

  const authService = inject(AuthService);

  await firstValueFrom( authService.checkStatus());

  return authService.isAdmin();
};
