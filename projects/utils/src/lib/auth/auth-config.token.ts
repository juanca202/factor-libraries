import { InjectionToken } from '@angular/core';
import type { FedcmAuth, JwtAuth } from './models/auth-config';

/**
 * Auth configuration via {@link JWT_AUTH_CONFIG} (JWT, session prefix, redirects)
 * and optional {@link FEDCM_AUTH_CONFIG}.
 *
 * @example
 * ```typescript
 * providers: [
 *   { provide: JWT_AUTH_CONFIG, useValue: jwtAuth },
 *   { provide: FEDCM_AUTH_CONFIG, useValue: fedcmAuth },
 * ]
 * ```
 */
export const JWT_AUTH_CONFIG = new InjectionToken<JwtAuth | undefined>('JWT_AUTH_CONFIG');

/** FedCM settings per provider key (e.g. `google`). */
export const FEDCM_AUTH_CONFIG = new InjectionToken<FedcmAuth | undefined>('FEDCM_AUTH_CONFIG');
