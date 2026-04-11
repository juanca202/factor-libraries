import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthProvider } from './auth-provider';

export const loginGuard: CanActivateFn = () => {
  const authProvider = inject(AuthProvider);
  const router = inject(Router);
  return authProvider.isLoggedIn() ? router.createUrlTree(['/']) : true;
};
