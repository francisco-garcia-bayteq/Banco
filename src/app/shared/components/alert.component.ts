import { Component, Input } from "@angular/core";
import { eAlertType } from "../../utils/enums/alert.enum";

@Component({
    selector: 'app-alert',
    standalone: false,
    template: `
    <div class="alert-container">
    <div class="alert alert-{{ type }}" role="alert">
      {{ message }}
    </div>
    <button type="button" class="btn btn-primary" (click)="close()">Cerrar</button>
    </div>
  `
})
export class AlertComponent {
    @Input() message: string = '';
    @Input() type: eAlertType = eAlertType.SUCCESS;

    close() {
        this.message = '';
    }

}