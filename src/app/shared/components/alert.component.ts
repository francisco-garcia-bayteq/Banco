import { Component, OnInit, OnDestroy } from "@angular/core";
import { AlertService } from "../../services/alert.service";
import { Subscription } from "rxjs";
import { AlertData } from "../../utils/models/alert.interface";

@Component({
    selector: 'app-alert',
    standalone: false,
    template: `
    <div class="alert-overlay" *ngIf="alertData">
        <div class="alert-modal">
            <div class="alert alert-{{ alertData.type }}" role="alert">
                {{ alertData.message }}
            </div>
            <button *ngIf="alertData.showCancelButton"
                type="button" 
                class="btn btn-secondary" 
                (click)="onCancel()">
                Cancelar
            </button>
            <button 
                type="button" 
                class="btn btn-primary" 
                (click)="onConfirm()">
                {{ alertData.confirmButtonLabel || (alertData.showConfirmButton ? 'Aceptar' : 'Cerrar') }}
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

    onConfirm() {
        if (this.alertData?.showConfirmButton && this.alertData?.onConfirm) {
            this.alertData.onConfirm();
        }

        this.alertService.closeAlert();
    }

    onCancel() {
        if (this.alertData?.showCancelButton && this.alertData?.onCancel) {
            this.alertData.onCancel();
        }

        this.alertService.closeAlert();
    }
}