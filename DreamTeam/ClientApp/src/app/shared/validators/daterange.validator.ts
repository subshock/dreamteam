import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isDate } from 'ngx-bootstrap/chronos';

export function DaterangeValidator(required: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!Array.isArray(control.value)) { return { 'array': true }; }
    if (control.value.length !== 2) { return { 'array': true }; }
    if (required && (isEmptyInputValue(control.value[0]) || isEmptyInputValue(control.value[1]))) { return { 'required': true }; }

    if (!isDate(control.value[0])) { return { 'startdate': true }; }
    if (!isDate(control.value[1])) { return { 'enddate': true }; }

    const startDate = new Date(control.value[0]);
    const endDate = new Date(control.value[1]);

    if (startDate > endDate) { return { 'range': true }; }

    return null;
  };
}

function isEmptyInputValue(value: any): boolean {
  return value == null || value.length === 0;
}
