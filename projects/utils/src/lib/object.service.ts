import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  filterNullProperties(obj: any): any {
    const mappedObj: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== 'undefined') {
        mappedObj[key] = obj[key];
      }
    });
    return mappedObj;
  }
  deepMerge(target: any, source: any) {
    source = structuredClone(source);
    target = structuredClone(target);
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], this.deepMerge(target[key], source[key]));
      }
    }
    return { ...target, ...source };
  }
}
