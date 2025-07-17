import { Component, OnInit, OnDestroy } from "@angular/core";
import { eAlertType } from "../../utils/enums/alert.enum";
import { AlertService, AlertData } from "../../services/alert.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-alert',
    standalone: false,
    template: `
    <div class="alert-overlay" *ngIf="alertData">
        <div class="alert-modal">
            <div class="alert alert-{{ alertData.type }}" role="alert">
                {{ alertData.message }}
            </div>
            <button 
                type="button" 
                class="btn btn-primary" 
                (click)="onClose()">
                {{ alertData.showConfirmButton ? 'Aceptar' : 'Cerrar' }}
            </button>
        </div>
    </div>
  `
})
export class AlertComponent implements OnInit, OnDestroy {
    alertData: AlertData | null = null;
    private subscription: Subscription = new Subscription();

    constructor(private alertService: AlertService) {}

    ngOnInit() {
        this.subscription = this.alertService.alertData$.subscribe(
            (data) => {
                this.alertData = data;
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onClose() {
        if (this.alertData?.showConfirmButton && this.alertData?.onConfirm) {
            // Ejecutar la función de confirmación
            this.alertData.onConfirm();
        }
        // Cerrar la alerta
        this.alertService.closeAlert();
    }
}