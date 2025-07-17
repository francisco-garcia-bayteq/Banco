import { TestBed } from '@angular/core/testing';
import { AlertService, AlertData } from './alert.service';
import { eAlertType } from '../utils/enums/alert.enum';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showAlert', () => {
    it('should emit alert data with default type', () => {
      spyOn(service['_alertSubject'], 'next');
      const message = 'Test message';

      service.showAlert(message);

      expect(service['_alertSubject'].next).toHaveBeenCalledWith({
        message,
        type: eAlertType.SUCCESS
      });
    });

    it('should emit alert data with custom type', () => {
      spyOn(service['_alertSubject'], 'next');
      const message = 'Error message';
      const type = eAlertType.DANGER;

      service.showAlert(message, type);

      expect(service['_alertSubject'].next).toHaveBeenCalledWith({
        message,
        type
      });
    });
  });

  describe('showConfirmAlert', () => {
    it('should emit confirm alert data', () => {
      spyOn(service['_alertSubject'], 'next');
      const message = 'Confirm message';
      const type = eAlertType.SUCCESS;
      const onConfirm = jasmine.createSpy('onConfirm');

      service.showConfirmAlert(message, type, onConfirm);

      expect(service['_alertSubject'].next).toHaveBeenCalledWith({
        message,
        type,
        showConfirmButton: true,
        onConfirm
      });
    });

    it('should emit confirm alert data without onConfirm callback', () => {
      spyOn(service['_alertSubject'], 'next');
      const message = 'Confirm message';
      const type = eAlertType.SUCCESS;

      service.showConfirmAlert(message, type);

      expect(service['_alertSubject'].next).toHaveBeenCalledWith({
        message,
        type,
        showConfirmButton: true,
        onConfirm: undefined
      });
    });
  });

  describe('closeAlert', () => {
    it('should emit null to close alert', () => {
      spyOn(service['_alertSubject'], 'next');

      service.closeAlert();

      expect(service['_alertSubject'].next).toHaveBeenCalledWith(null);
    });
  });

  describe('alertData$', () => {
    it('should return observable from subject', () => {
      const alertData: AlertData = {
        message: 'Test',
        type: eAlertType.SUCCESS
      };

      service.showAlert('Test');
      
      service.alertData$.subscribe(data => {
        expect(data).toEqual(alertData);
      });
    });
  });
}); 