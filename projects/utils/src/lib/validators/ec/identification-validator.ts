import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { getIdentificationType } from './identification-type';

/**
 * Creates a validator function for Ecuadorian identification numbers (cédula or RUC).
 *
 * @param type - The type of identification to validate
 *   - 'cedula': Validates cédula (10 digits)
 *   - 'ruc_natural': Validates RUC for natural persons (13 digits)
 *   - 'ruc_privada': Validates RUC for private companies (13 digits)
 *   - 'ruc_publica': Validates RUC for public companies (13 digits)
 *   - 'ruc': Validates any type of RUC
 *   - 'id': Validates any valid identification type
 * @returns A validator function that returns an error object if validation fails
 *
 * @example
 * ```typescript
 * const control = new FormControl('', [identificationValidator('cedula')]);
 * ```
 */
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