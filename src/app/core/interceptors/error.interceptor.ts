import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { eAlertType } from '../../utils/enums/alert.enum';

export function errorInterceptor(
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const alertService = inject(AlertService);
  
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
            break;
          case 401:
            errorMessage = 'No autorizado. Debes iniciar sesión.';
            break;
          case 403:
            errorMessage = 'Acceso denegado. No tienes permisos para esta acción.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 409:
            errorMessage = 'Conflicto. El recurso ya existe o hay un conflicto de datos.';
            break;
          case 422:
            errorMessage = 'Datos de entrada inválidos.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          case 502:
            errorMessage = 'Error de puerta de enlace. El servidor no está disponible.';
            break;
          case 503:
            errorMessage = 'Servicio no disponible temporalmente.';
            break;
          case 504:
            errorMessage = 'Tiempo de espera agotado.';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.message}`;
        }
      }

      // Mostrar alerta de error
      alertService.showAlert(errorMessage, eAlertType.DANGER);

      // Log del error para debugging (opcional)
      console.error('Error HTTP:', error);

      return throwError(() => error);
    })
  );
} 