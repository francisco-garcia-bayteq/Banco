import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { eInputType } from '../../utils/enums/input.enum';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: false,
    template: `
		<div class="form-group">
			<label for="{{ name }}" class="form-label">{{ label }}</label>
			<input 
				type="{{ type }}" 
				id="{{ name }}" 
				[formControl]="formControl" 
				[placeholder]="placeholder"
				class="form-input"
				[class.error]="validarCampo()" />
			<small *ngIf="validarCampo()" class="error-message">
				{{ messageError() }}
			</small>
		</div>
	`,

    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() name: string = '';
    @Input() type: eInputType = eInputType.TEXT;
    @Input() formControl: FormControl = new FormControl('');
    @Input() placeholder: string = '';
    @Input() class: string = '';
    @Input() customErrorMessage: string = '';
    
    public value: any;
    public locale: any;

    private onChange: (value: any) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: any): void {
        this.value = value;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }


    validarCampo() {
        if (this.formControl.errors != undefined && this.formControl.touched === true) {
            return true;
        }
        return false;
    }

    messageError(): string {
        const errores = this.formControl.errors || {};
        let msj = 'Campo no válido';
        for (const key of Object.keys(errores)) {
            switch (key) {
                case 'required':
                    msj = 'Este campo es requerido!';
                    break;
                case 'minlength':
                    msj = 'Este campo debe tener al menos ' + errores[key].requiredLength + ' caracteres!';
                    break;
                case 'maxlength':
                    msj = 'Este campo debe tener menos de ' + errores[key].requiredLength + ' caracteres!';
                    break;
                case 'isDateGreaterThanCurrent':
                    msj = 'La fecha debe ser mayor a la fecha actual!';
                    break;
                case 'isDateNYearsAfterCurrent':
                    msj = 'La fecha debe ser al menos 1 año después de la fecha actual!';
                    break;
            }
        }
        if (this.customErrorMessage) {
            msj = this.customErrorMessage;
        }
        return msj;
    }

}
