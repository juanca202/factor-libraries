import { InjectionToken } from '@angular/core';

export interface UiOptions {
  iconSettings: {
    path: string;
    collection: string;
    mode: 'external' | undefined;
  };
}

export const UI_OPTIONS = new InjectionToken<UiOptions>('UI_OPTIONS');
