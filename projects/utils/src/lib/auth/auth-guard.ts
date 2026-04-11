import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Storage } from '../storage';
import { AUTH_CONFIG } from './auth-config.token';
import { AuthProvider } from './auth-provider';

export const authGuard: CanActivateFn = async (route, state) => {
  const config = inject(AUTH_CONFIG);
  const authProvider = inject(AuthProvider);
  const storageService = inject(Storage);
  const router = inject(Router);

  if (!authProvider.isLoggedIn()) {
    storageService.set(`${config.sessionPrefix}_rdi`, state.url);
    if (config.authRedirectPath) {
      return router.createUrlTree([config.authRedirectPath]);
    } else {
      authProvider.login();
    }
    return false;
  }
  return true;
};
