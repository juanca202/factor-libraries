import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { getIdentificationType } from './identification-type';

export function identificationValidator(type: 'cedula' | 'ruc_natural' | 'ruc_privada' | 'ruc_publica' | 'ruc' | 'id'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const number: string = String(control.value);
    if (number && number.trim() !== '') {
      const parsedType = getIdentificationType(number);
      switch (type) {
        case 'cedula':
        case 'ruc_natural':
        case 'ruc_privada':
        case 'ruc_publica':
          return !parsedType || parsedType !== type ? { invalidIdentification: true } : null;
          break;
        case 'ruc':
          return !parsedType || ['ruc_natural', 'ruc_privada', 'ruc_publica'].indexOf(parsedType) === -1 ? { invalidIdentification: true } : null;
          break;
        case 'id':
          return !parsedType ? { invalidIdentification: true } : null;
          break;
        default:
          return null;
          break;
      }
    } else {
      return null;
    }
  };
}
