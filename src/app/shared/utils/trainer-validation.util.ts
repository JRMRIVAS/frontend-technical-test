import { AbstractControl, ValidationErrors } from '@angular/forms';
import { IdentificationType } from '../../core/models/trainer.model';

// Full years since the birth date (expects yyyy-mm-dd, which is what <input type="date"> gives)
export function calculateAge(birthDate: string): number {
    // Splitting by hand because new Date('yyyy-mm-dd') is read as UTC
    // and can shift the day depending on the timezone
    const [year, month, day] = birthDate.split('-').map(Number);
    const today = new Date();

    let age = today.getFullYear() - year;
    const hadBirthdayThisYear =
        today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);

    if (!hadBirthdayThisYear) age--;
    return age;
}

export function isAdult(birthDate: string): boolean {
    return calculateAge(birthDate) >= 18;
}

// One place to decide which document the trainer needs
export function getDocumentType(birthDate: string): IdentificationType {
    return isAdult(birthDate) ? 'DUI' : 'CARNET_MINORIDAD';
}

// 8 digits, a dash and 1 digit. Example: 12345678-9
export const DUI_PATTERN = /^\d{8}-\d$/;

// The carnet has no national format, so we only ask for a range of digits
export const CARNET_MIN_DIGITS = 5;
export const CARNET_MAX_DIGITS = 12;
export const CARNET_PATTERN = new RegExp(`^\\d{${CARNET_MIN_DIGITS},${CARNET_MAX_DIGITS}}$`);

// Keeps only digits (max 9) and adds the dash once the 9th digit is typed
export function formatDui(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    return digits.length > 8 ? `${digits.slice(0, 8)}-${digits.slice(8)}` : digits;
}

// Keeps only digits, up to the carnet limit
export function formatCarnet(value: string): string {
    return value.replace(/\D/g, '').slice(0, CARNET_MAX_DIGITS);
}

// Letters allowed in a name, Spanish accents and ñ included
const NAME_LETTERS = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';

// Words made only of letters, separated by a single space. Example: Carlos Saul Torres
export const NAME_PATTERN = new RegExp(`^[${NAME_LETTERS}]+( [${NAME_LETTERS}]+)*$`);

// Cleans the name while typing: removes numbers and symbols,
// a space at the start and double spaces
export function sanitizeName(value: string): string {
    return value
        .replace(new RegExp(`[^${NAME_LETTERS} ]`, 'g'), '')
        .replace(/ {2,}/g, ' ')
        .replace(/^ /, '');
}

// A validator is just a function that gets the control and returns an error object or null
export function nameValidator(control: AbstractControl): ValidationErrors | null {
    // Trimmed, so a trailing space while typing doesn't count as an error
    const value = (control.value as string).trim();
    if (!value) return null; // Validators.required takes care of empty values

    return NAME_PATTERN.test(value) ? null : { invalidName: true };
}

export function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;

    // A future date gives a negative age, so we can reuse calculateAge
    return calculateAge(value) < 0 ? { futureDate: true } : null;
}