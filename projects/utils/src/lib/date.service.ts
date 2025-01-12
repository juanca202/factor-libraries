import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  getDate(date: string): Date {
    const dateParts: string[] = date.split('T')[0].split('-');
    return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
  }
}
