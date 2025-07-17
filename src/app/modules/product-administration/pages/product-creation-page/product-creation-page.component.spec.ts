import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductCreationPageComponent } from './product-creation-page.component';
import { ProductsService } from '../../../../services/products.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Product } from '../../../../utils/models/product.interface';
import { ApiResponse } from '../../../../utils/models/api.interface';
import { eInputType } from '../../../../utils/enums/input.enum';
import { eAlertType } from '../../../../utils/enums/alert.enum';
import { mockProducts } from '../../test-mocks/product-mocks';
import { InputComponent } from '../../../../shared/components/input.component';
import { AlertComponent } from '../../../../shared/components/alert.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductCreationPageComponent', () => {
  let component: ProductCreationPageComponent;
  let fixture: ComponentFixture<ProductCreationPageComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  const mockSuccessResponse: ApiResponse<Product> = {
    message: 'Product added successfully',
    data: mockProducts[0]
  };

  const mockErrorResponse = {
    name: 'BadRequestError',
    message: 'Invalid body, check \'errors\' property for more info.'
  };

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['createProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);

    await TestBed.configureTestingModule({
      declarations: [ 
        ProductCreationPageComponent,
        InputComponent,
        AlertComponent
      ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    mockProductsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAlertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and subscribe to form changes', () => {
      spyOn(component.productForm.valueChanges, 'subscribe');

      component.ngOnInit();

      expect(component.productForm.valueChanges.subscribe).toHaveBeenCalled();
    });
  });

  describe('productForm', () => {
    it('should have correct form structure', () => {
      expect(component.productForm).toBeDefined();
      expect(component.productForm.get('id')).toBeDefined();
      expect(component.productForm.get('name')).toBeDefined();
      expect(component.productForm.get('logo')).toBeDefined();
      expect(component.productForm.get('description')).toBeDefined();
      expect(component.productForm.get('date_release')).toBeDefined();
      expect(component.productForm.get('date_revision')).toBeDefined();
    });

    it('should have correct validators for id field', () => {
      const idControl = component.productForm.get('id');

      expect(idControl?.hasValidator).toBeDefined();
      expect(idControl?.errors).toBeTruthy();
    });

    it('should have correct validators for name field', () => {
      const nameControl = component.productForm.get('name');

      expect(nameControl?.hasValidator).toBeDefined();
      expect(nameControl?.errors).toBeTruthy();
    });

    it('should have correct validators for logo field', () => {
      const logoControl = component.productForm.get('logo');

      expect(logoControl?.hasValidator).toBeDefined();
      expect(logoControl?.errors).toBeTruthy();
    });

    it('should have correct validators for description field', () => {
      const descriptionControl = component.productForm.get('description');

      expect(descriptionControl?.hasValidator).toBeDefined();
      expect(descriptionControl?.errors).toBeTruthy();
    });

    it('should have correct validators for date_release field', () => {
      const dateReleaseControl = component.productForm.get('date_release');

      expect(dateReleaseControl?.hasValidator).toBeDefined();
      expect(dateReleaseControl?.errors).toBeTruthy();
    });

    it('should have correct validators for date_revision field', () => {
      const dateRevisionControl = component.productForm.get('date_revision');

      expect(dateRevisionControl?.hasValidator).toBeDefined();
      expect(dateRevisionControl?.errors).toBeTruthy();
    });
  });

  describe('sendForm', () => {
    it('should create product successfully and navigate to administration page', fakeAsync(() => {
      mockProductsService.createProduct.and.returnValue(of(mockSuccessResponse));
      component.productForm.patchValue({
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2025-01-01',
        date_revision: '2025-01-01'
      });

      component.sendForm();
      tick();

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(component.error).toBe('');
      expect(mockAlertService.showAlert).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-administration']);
    }));

    it('should handle service error and show error alert', fakeAsync(() => {
      mockProductsService.createProduct.and.returnValue(throwError(() => new Error('Network error')));
      component.productForm.patchValue({
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2025-01-01',
        date_revision: '2025-01-01'
      });

      component.sendForm();
      tick();

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Error al crear el producto', eAlertType.DANGER);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should handle invalid response from service', fakeAsync(() => {
      mockProductsService.createProduct.and.returnValue(of({} as ApiResponse<Product>));
      component.productForm.patchValue({
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2025-01-01',
        date_revision: '2025-01-01'
      });

      component.sendForm();
      tick();

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Error al crear el producto', eAlertType.DANGER);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should handle 400 error response', fakeAsync(() => {
      mockProductsService.createProduct.and.returnValue(throwError(() => ({
        error: mockErrorResponse,
        status: 400
      })));
      component.productForm.patchValue({
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'test-logo.png',
        date_release: '2025-01-01',
        date_revision: '2025-01-01'
      });

      component.sendForm();
      tick();

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Error al crear el producto', eAlertType.DANGER);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('form validation', () => {
    it('should validate required fields', () => {
      const form = component.productForm;

      expect(form.get('id')?.hasError('required')).toBe(true);
      expect(form.get('name')?.hasError('required')).toBe(true);
      expect(form.get('logo')?.hasError('required')).toBe(true);
      expect(form.get('description')?.hasError('required')).toBe(true);
      expect(form.get('date_release')?.hasError('required')).toBe(true);
      expect(form.get('date_revision')?.hasError('required')).toBe(true);
    });

    it('should validate id field length constraints', () => {
      const idControl = component.productForm.get('id');

      idControl?.setValue('ab');
      expect(idControl?.hasError('minlength')).toBe(true);

      idControl?.setValue('abcdefghijk');
      expect(idControl?.hasError('maxlength')).toBe(true);

      idControl?.setValue('abc');
      expect(idControl?.hasError('minlength')).toBe(false);
      expect(idControl?.hasError('maxlength')).toBe(false);
    });

    it('should validate name field length constraints', () => {
      const nameControl = component.productForm.get('name');

      nameControl?.setValue('abcd');
      expect(nameControl?.hasError('minlength')).toBe(true);

      nameControl?.setValue('a'.repeat(101));
      expect(nameControl?.hasError('maxlength')).toBe(true);

      nameControl?.setValue('Valid Name');
      expect(nameControl?.hasError('minlength')).toBe(false);
      expect(nameControl?.hasError('maxlength')).toBe(false);
    });

    it('should validate description field length constraints', () => {
      const descriptionControl = component.productForm.get('description');

      descriptionControl?.setValue('Short');
      expect(descriptionControl?.hasError('minlength')).toBe(true);

      descriptionControl?.setValue('a'.repeat(201));
      expect(descriptionControl?.hasError('maxlength')).toBe(true);

      descriptionControl?.setValue('Valid description with enough characters');
      expect(descriptionControl?.hasError('minlength')).toBe(false);
      expect(descriptionControl?.hasError('maxlength')).toBe(false);
    });
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      expect(component.error).toBe('');
      expect(component.typeInput).toBe(eInputType);
      expect(component.productForm).toBeDefined();
    });
  });

  describe('form value changes subscription', () => {
    it('should log form value changes', () => {
      spyOn(console, 'log');

      component.productForm.patchValue({
        id: 'test-id',
        name: 'test-name'
      });

      expect(console.log).toHaveBeenCalled();
    });
  });
});
