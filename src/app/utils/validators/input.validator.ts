import { AbstractControl, ValidationErrors } from "@angular/forms";

export function isDateRevisionOneYearAfterRelease(control: AbstractControl): ValidationErrors | null {
    const form = control.parent;
    if (!form) return null;
    const releaseValue = form.get('date_release')?.value;
    const revisionValue = control.value;
    if (!releaseValue || !revisionValue) return null;
    const [rY, rM, rD] = releaseValue.split('-').map(Number);
    const releaseDate = new Date(rY, rM - 1, rD);
    const [vY, vM, vD] = revisionValue.split('-').map(Number);
    const revisionDate = new Date(vY, vM - 1, vD);
    const oneYearAfter = new Date(releaseDate);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
    const sameDay = revisionDate.getDate() === oneYearAfter.getDate() &&
        revisionDate.getMonth() === oneYearAfter.getMonth() &&
        revisionDate.getFullYear() === oneYearAfter.getFullYear();
    return sameDay ? null : { dateRevisionOneYearAfterRelease: true };
}

export function isDateNYearsAfterCurrent(years: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const parts = control.value.split('-');
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const currentDate = new Date();
        const sameDayMonth = date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === (currentDate.getFullYear() + years);
        return sameDayMonth ? null : { isDateNYearsAfterCurrent: true };
    };
}

export function isDateGreaterThanCurrent() {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const parts = control.value.split('-');
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return date.getTime() >= currentDate.getTime() ? null : { isDateGreaterThanCurrent: true };
    };
}
