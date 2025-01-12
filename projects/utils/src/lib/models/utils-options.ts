import { InjectionToken } from "@angular/core";

export interface UtilsOptions {
    graphqlEndpoint: string;
    restApiPath: string;
}

export const UTILS_OPTIONS = new InjectionToken<UtilsOptions>('UTILS_OPTIONS');