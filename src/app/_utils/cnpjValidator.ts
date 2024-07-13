import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cnpjValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const cnpj = control.value;

        if (!cnpj) {
            return null;
        }

        // Remover caracteres não numéricos
        const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');

        if (cleanedCnpj.length !== 14) {
            return { invalidCNPJ: true };
        }

        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleanedCnpj)) {
            return { invalidCNPJ: true };
        }

        // Calcular dígitos verificadores
        let length = cleanedCnpj.length - 2;
        let numbers = cleanedCnpj.substring(0, length);
        const digits = cleanedCnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(0))) {
            return { invalidCNPJ: true };
        }

        length += 1;
        numbers = cleanedCnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(1))) {
            return { invalidCNPJ: true };
        }

        return null;
    };
}