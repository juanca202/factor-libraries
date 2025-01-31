function lengthValidator(number: string, digits: number): boolean {
    let value = true;
    if (number.trim() === '') { // No puede estar vacio
        value = false;
    } else if (number.trim().length !== digits) { // Cantidad de dígitos
        value = false;
    }
    return value;
}
function provinceValidator(number: string): boolean {
    let value = true;
    const code = Number(number);
    if ((code < 0 || code > 24) && code !== 30) {
        value = false;
    }
    return value;
}
function typeValidator(number: string, type: string): boolean {
    let value = true;
    const code = Number(number);
    switch (type) {
        case 'cedula':
            if (code < 0 || code > 6) {
                value = false;
            }
            break;
        case 'ruc_natural':
            if (code < 0 || code > 5) {
                value = false;
            }
            break;
        case 'ruc_privada':
            if (code !== 9) {
                value = false;
            }
            break;
        case 'ruc_publica':
            if (code !== 6) {
                value = false;
            }
            break;
        default:
            value = false;
            break;
    }
    return value;
}
function module10Validator(number: string, verifierCodeString: string): boolean {
    const coefficients: number[] = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verifierCode = Number(verifierCodeString);
    const numberParts: string[] = number.split('');
    let value = true;
    let total = 0;
    let result: number;
    numberParts.forEach((part: string, index: number) => {
        let valuePosition: number = Number(part) * coefficients[index];
        if (valuePosition >= 10) {
            let newValuePosition: string[] = String(valuePosition).split('');
            let sum: string = newValuePosition.reduce((previousValue: string, currentValue: string) => {
                return String(Number(currentValue) + Number(previousValue));
            });
            valuePosition = Number(sum);
        }
        total += valuePosition;
    });
    const residue: number = total % 10;
    if (residue === 0) {
        result = 0;
    } else {
        result = 10 - residue;
    }
    if (result !== verifierCode) {
        value = false;
    }
    return value;
}
function module11Validator(number: string, verifierCodeString: string, type: string): boolean {
    const verifierCode = Number(verifierCodeString);
    const numberParts: string[] = number.split('');
    let value = true;
    let coefficients: number[];
    let total = 0;
    let result: number;
    switch (type) {
        case 'ruc_privada':
            coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];
            break;
        case 'ruc_publica':
            coefficients = [3, 2, 7, 6, 5, 4, 3, 2];
            break;
        default:
            return false;
            break;
    }
    numberParts.forEach((part: string, index: number) => {
        let valuePosition: number = Number(part) * coefficients[index];
        total += valuePosition;
    });
    const residue: number = total % 11;
    if (residue === 0) {
        result = 0;
    } else {
        result = 11 - residue;
    }
    if (result !== verifierCode) {
        value = false;
    }
    return value;
}
function storeCodeValidator(number: string): boolean {
    let value = true;
    const code = Number(number);
    if (code < 1) {
        value = false;
    }
    return value;
}
export function getIdentificationType(number: string): string | null {
    let type: string | null = null;
    if (lengthValidator(number, 10) &&
        provinceValidator(number.substr(0, 2)) &&
        //typeValidator(number.substr(2, 1), 'cedula') &&
        module10Validator(number.substr(0, 9), number.substr(9, 1))) {
            type = 'cedula';
    } else if (lengthValidator(number, 13) &&
        provinceValidator(number.substr(0, 2)) &&
        //typeValidator(number.substr(2, 1), 'ruc_natural') &&
        storeCodeValidator(number.substr(10, 3)) &&
        module10Validator(number.substr(0, 9), number.substr(9, 1))
    ) {
            type = 'ruc_natural';
    } else if (lengthValidator(number, 13) &&
        provinceValidator(number.substr(0, 2)) &&
        typeValidator(number.substr(2, 1), 'ruc_privada') &&
        storeCodeValidator(number.substr(10, 3)) //&&
        //module11Validator(number.substr(0, 9), number.substr(9, 1), 'ruc_privada')
    ) {
            type = 'ruc_privada';
    } else if (lengthValidator(number, 13) &&
        provinceValidator(number.substr(0, 2)) &&
        typeValidator(number.substr(2, 1), 'ruc_publica') &&
        storeCodeValidator(number.substr(9, 4)) //&&
        //module11Validator(number.substr(0, 8), number.substr(8, 1), 'ruc_publica')
    ) {
            type = 'ruc_publica';
    }
    return type;
}