import { Inject, Injectable } from '@angular/core';
import { UI_OPTIONS, UiOptions } from './models/ui-options';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  
  constructor(@Inject(UI_OPTIONS) private options: UiOptions) {}

  get(): UiOptions {
    return this.options;
  } 
}
