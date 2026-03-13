import { InjectionToken } from '@angular/core';
import type { MsalConfig } from './models/msal-config';

/**
 * Token de inyección para la configuración de MSAL.
 * Proporcionar en app.config con valores del environment.
 *
 * @example
 * ```typescript
 * import { MSAL_CONFIG } from '@factor_ec/msal';
 * import { environment } from '@/environments/environment';
 *
 * providers: [
 *   { provide: MSAL_CONFIG, useValue: environment.msal }
 * ]
 * ```
 */
export const MSAL_CONFIG = new InjectionToken<MsalConfig>('MSAL_CONFIG');
