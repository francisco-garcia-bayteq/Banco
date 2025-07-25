import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { eAlertType } from "../utils/enums/alert.enum";
import { AlertData } from "../utils/models/alert.interface";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private _alertSubject = new Subject<AlertData | null>();
    alertData$ = this._alertSubject.asObservable();

    showAlert(message: string, type: eAlertType = eAlertType.SUCCESS) {
        this._alertSubject.next({ message, type });
    }

    showConfirmAlert(message: string, type: eAlertType = eAlertType.SUCCESS, onConfirm?: () => void) {
        this._alertSubject.next({ 
            message, 
            type, 
            showConfirmButton: true,
            onConfirm
        });
    }

    showConfirmAlertWithCancel(message: string, type: eAlertType = eAlertType.SUCCESS, onConfirm?: () => void, onCancel?: () => void) {
        this._alertSubject.next({ 
            message, 
            type, 
            showConfirmButton: true,
            showCancelButton: true,
            onConfirm,
            onCancel
        });
    }

    closeAlert() {
        this._alertSubject.next(null);
    }

    confirm() {
        const currentAlert = this._alertSubject.asObservable();
    }
} 