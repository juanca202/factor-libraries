import { PublicClientApplication } from '@azure/msal-browser';

import type { MsalConfig } from './models/msal-config';

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
export function createMsalInstance(config: MsalConfig): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      redirectUri: config.redirectUri,
      postLogoutRedirectUri: config.postLogoutRedirectUri ?? config.redirectUri,
    },
  });
}
