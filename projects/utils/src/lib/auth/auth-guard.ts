import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Storage } from '../storage';
import { JWT_AUTH_CONFIG } from './auth-config.token';
import { AuthProvider } from './auth-provider';

export const authGuard: CanActivateFn = async (route, state) => {
  const jwtAuth = inject(JWT_AUTH_CONFIG, { optional: true });
  const sessionPrefix = jwtAuth?.sessionPrefix ?? '';
  const redirectUri = jwtAuth?.redirectUri ?? '';
  const authProvider = inject(AuthProvider);
  const storageService = inject(Storage);
  const router = inject(Router);

  if (!authProvider.isLoggedIn()) {
    storageService.set(`${sessionPrefix}_rdi`, state.url);
    if (redirectUri) {
      return router.createUrlTree([redirectUri]);
    } else {
      authProvider.login();
    }
    return false;
  }
  return true;
};
