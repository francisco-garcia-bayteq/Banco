import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { AlertService } from '../../services/alert.service';
import { eAlertType } from '../../utils/enums/alert.enum';

describe('errorInterceptor', () => {
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    });

    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  it('should handle 400 error correctly', () => {
    const request = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: 'Bad Request',
      status: 400,
      statusText: 'Bad Request'
    });

    const mockNext: HttpHandlerFn = () => throwError(() => errorResponse);

    errorInterceptor(request, mockNext).subscribe({
      error: (error) => {
        expect(alertService.showAlert).toHaveBeenCalledWith(
          'Solicitud incorrecta. Verifica los datos enviados.',
          eAlertType.DANGER
        );
        expect(error).toBe(errorResponse);
      }
    });
  });

  it('should handle 404 error correctly', () => {
    const request = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found'
    });

    const mockNext: HttpHandlerFn = () => throwError(() => errorResponse);

    errorInterceptor(request, mockNext).subscribe({
      error: (error) => {
        expect(alertService.showAlert).toHaveBeenCalledWith(
          'Recurso no encontrado.',
          eAlertType.DANGER
        );
        expect(error).toBe(errorResponse);
      }
    });
  });

  it('should handle 500 error correctly', () => {
    const request = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: 'Internal Server Error',
      status: 500,
      statusText: 'Internal Server Error'
    });

    const mockNext: HttpHandlerFn = () => throwError(() => errorResponse);

    errorInterceptor(request, mockNext).subscribe({
      error: (error) => {
        expect(alertService.showAlert).toHaveBeenCalledWith(
          'Error interno del servidor. Inténtalo más tarde.',
          eAlertType.DANGER
        );
        expect(error).toBe(errorResponse);
      }
    });
  });

  it('should handle client-side errors correctly', () => {
    const request = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: new ErrorEvent('Network error', { message: 'Connection failed' }),
      status: 0,
      statusText: 'Unknown Error'
    });

    const mockNext: HttpHandlerFn = () => throwError(() => errorResponse);

    errorInterceptor(request, mockNext).subscribe({
      error: (error) => {
        expect(alertService.showAlert).toHaveBeenCalledWith(
          'Error: Connection failed',
          eAlertType.DANGER
        );
        expect(error).toBe(errorResponse);
      }
    });
  });

  it('should handle unknown status codes correctly', () => {
    const request = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: 'Unknown Error',
      status: 999,
      statusText: 'Unknown Status'
    });

    const mockNext: HttpHandlerFn = () => throwError(() => errorResponse);

    errorInterceptor(request, mockNext).subscribe({
      error: (error) => {
        expect(alertService.showAlert).toHaveBeenCalledWith(
          'Error 999: Unknown Status',
          eAlertType.DANGER
        );
        expect(error).toBe(errorResponse);
      }
    });
  });

  it('should pass through successful requests', () => {
    const request = new HttpRequest('GET', '/api/test');
    const mockResponse = new HttpResponse({ body: { data: 'success' } });

    const mockNext: HttpHandlerFn = () => of(mockResponse);

    errorInterceptor(request, mockNext).subscribe((response) => {
      expect(response).toBe(mockResponse);
      expect(alertService.showAlert).not.toHaveBeenCalled();
    });
  });
}); 