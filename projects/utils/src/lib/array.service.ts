import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayService {
  public merge(arrays: any[], prop: string): any[] {
    const merged: any = {};
    arrays.forEach(arr => {
      arr.forEach((item: any) => {
        merged[item[prop]] = Object.assign({}, merged[item[prop]], item);
      });
    });
    return Object.values(merged);
  }
}
