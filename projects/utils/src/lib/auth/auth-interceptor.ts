import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { JWT_AUTH_CONFIG } from './auth-config.token';
import { AuthService } from './auth-service';
import { AuthProvider } from './auth-provider';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtAuth = inject(JWT_AUTH_CONFIG, { optional: true });
  const authProvider = inject(AuthProvider) as AuthService;
  const authReq = authProvider.addAuthenticationToken(req);
  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        switch ((error as HttpErrorResponse).status) {
          case 401:
            if (jwtAuth && !req.url.includes(jwtAuth.refreshTokenUrl)) {
              return authProvider.handle401Error(error, req, next);
            } else {
              authProvider.logout();
              return throwError(() => error);
            }
          default:
            return throwError(() => error);
        }
      } else {
        return throwError(() => error);
      }
    })
  );
};
