import { eAlertType } from "../enums/alert.enum";

export interface AlertData {
    message: string;
    type: eAlertType;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    confirmButtonLabel?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
}