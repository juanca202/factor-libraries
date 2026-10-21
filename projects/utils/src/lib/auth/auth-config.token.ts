import { InjectionToken } from '@angular/core';
import type { FedcmAuthConfig, JwtAuthConfig } from './models/auth-config';

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
export const JWT_AUTH_CONFIG = new InjectionToken<JwtAuthConfig | undefined>('JWT_AUTH_CONFIG');

/** Optional prefix used to namespace auth session keys/cookies. */
export const SESSION_PREFIX = new InjectionToken<string | undefined>('SESSION_PREFIX');

/** FedCM settings per provider key (e.g. `google`). */
export const FEDCM_AUTH_CONFIG = new InjectionToken<FedcmAuthConfig | undefined>('FEDCM_AUTH_CONFIG');
