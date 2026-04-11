import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthProvider } from './auth-provider';

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
