import { eAlertType } from "../enums/alert.enum";

export interface AlertData {
    message: string;
    type: eAlertType;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
  }