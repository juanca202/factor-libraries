import { InjectionToken } from '@angular/core';
import { Configuration } from '@azure/msal-browser';

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
export const MSAL_CONFIG = new InjectionToken<Configuration>('MSAL_CONFIG');
