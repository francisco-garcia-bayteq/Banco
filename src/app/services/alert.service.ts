import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { eAlertType } from "../utils/enums/alert.enum";

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private _alertSubject = new Subject<{message: string, type: eAlertType}>();
    alertMessage$ = this._alertSubject.asObservable();

    showAlert(message: string, type: eAlertType = eAlertType.SUCCESS) {
        this._alertSubject.next({message, type});
    }

    closeAlert() {
        this._alertSubject.next({message: '', type: eAlertType.SUCCESS});
    }
}   