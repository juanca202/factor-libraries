import { Injectable, inject } from '@angular/core';
import { UI_OPTIONS, UiOptions } from './models/ui-options';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private options = inject<UiOptions>(UI_OPTIONS);


  get(): UiOptions {
    return this.options;
  } 
}
