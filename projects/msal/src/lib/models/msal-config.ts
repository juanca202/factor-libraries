/**
 * Configuración requerida para MSAL (Microsoft Authentication Library).
 * Proporcionar via token MSAL_CONFIG desde app.config con valores del environment.
 *
 * @example
 * ```typescript
 * // environment.ts
 * export const environment = {
 *   msal: {
 *     clientId: 'tu-client-id',
 *     authority: 'https://login.microsoftonline.com/tu-tenant-id',
 *     redirectUri: 'http://localhost:4200',
 *     postLogoutRedirectUri: 'http://localhost:4200'
 *   }
 * };
 *
 * // app.config.ts (standalone)
 * import { MSAL_INSTANCE } from '@azure/msal-angular';
 * import { MSAL_CONFIG, createMsalInstance } from '@factor_ec/msal';
 * import { environment } from './environments/environment';
 *
 * providers: [
 *   { provide: MSAL_CONFIG, useValue: environment.msal },
 *   { provide: MSAL_INSTANCE, useFactory: createMsalInstance, deps: [MSAL_CONFIG] }
 * ]
 * ```
 */
export interface MsalConfig {
  /** Application (client) ID del registro en Azure AD / Entra ID */
  clientId: string;
  /** URL de autoridad (ej: https://login.microsoftonline.com/{tenant-id} o /common) */
  authority: string;
  /** URI de redirección después del login */
  redirectUri: string;
  /** URI de redirección después del logout (opcional) */
  postLogoutRedirectUri?: string;
}
