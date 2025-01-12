import { Inject, Injectable } from '@angular/core';
import { UTILS_OPTIONS, UtilsOptions } from './models/utils-options';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(@Inject(UTILS_OPTIONS) private options: UtilsOptions) {}

  get(): UtilsOptions {
    return this.options;
  }
}
