import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { eAlertType } from "../utils/enums/alert.enum";

export interface AlertData {
  message: string;
  type: eAlertType;
  showConfirmButton?: boolean;
  onConfirm?: () => void;
}

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

    closeAlert() {
        this._alertSubject.next(null);
    }

    confirm() {
        const currentAlert = this._alertSubject.asObservable();
    }
} 