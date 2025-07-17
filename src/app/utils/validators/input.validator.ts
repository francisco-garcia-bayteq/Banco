import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";

export function isDateNYearsAfterCurrent(years: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }
        const date = new Date(control.value.split('-')[0], control.value.split('-')[1] - 1, control.value.split('-')[2]);
        const currentDate = new Date();
        if ((date.getDate() === currentDate.getDate()) &&
            (date.getMonth() === currentDate.getMonth()) &&
            (date.getFullYear() === (currentDate.getFullYear() + years))) {
            return null;
        }
        return { isDateNYearsAfterCurrent: true };
    }
}

export function isDateGreaterThanCurrent() {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }
        const date = new Date(control.value.split('-')[0], control.value.split('-')[1] - 1, control.value.split('-')[2]);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (date.getTime() >= currentDate.getTime()) {
            return null;
        }
        return { isDateGreaterThanCurrent: true };
    }
}
