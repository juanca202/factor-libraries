import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Storage } from '../storage';
import { AUTH_CONFIG } from './auth-config.token';
import { AuthProvider } from './auth-provider';

export const authGuard: CanActivateFn = async (route, state) => {
  const config = inject(AUTH_CONFIG);
  const router = inject(Router);
  const authProvider = inject(AuthProvider);
  const storageService = inject(Storage);

  if (!authProvider.isLoggedIn()) {
    storageService.set(`${config.sessionPrefix}_rdi`, state.url);
    return router.createUrlTree([window.innerWidth < 1000 ? '/auth' : '/signin']);
  }
  return true;
};

export const loginGuard: CanActivateFn = () => {
  const authProvider = inject(AuthProvider);
  const router = inject(Router);
  return authProvider.isLoggedIn() ? router.createUrlTree(['/']) : true;
};

export const resetGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authProvider = inject(AuthProvider);
  const router = inject(Router);
  const token = route.queryParamMap.get('token');

  if (token && !authProvider.isLoggedIn()) {
    return true;
  } else if (authProvider.isLoggedIn()) {
    return router.createUrlTree(['/']);
  } else {
    router.navigateByUrl(`/error/403`, { skipLocationChange: true });
    return false;
  }
};
