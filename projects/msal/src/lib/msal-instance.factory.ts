import { Configuration, PublicClientApplication } from '@azure/msal-browser';

/**
 * Factory que crea la instancia de MSAL usando la configuración inyectada via MSAL_CONFIG.
 * Usar con el token MSAL_INSTANCE de @azure/msal-angular.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { MSAL_INSTANCE } from '@azure/msal-angular';
 * import { MSAL_CONFIG, createMsalInstance } from '@factor_ec/msal';
 * import { environment } from './environments/environment';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     { provide: MSAL_CONFIG, useValue: environment.msal },
 *     {
 *       provide: MSAL_INSTANCE,
 *       useFactory: createMsalInstance,
 *       deps: [MSAL_CONFIG]
 *     }
 *   ]
 * };
 * ```
 */
export function createMsalInstance(config: Configuration): PublicClientApplication {
  return new PublicClientApplication(config);
}
