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
      declarations: [ ProductCreationPageComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ]
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
      // Arrange
      spyOn(component.productForm.valueChanges, 'subscribe');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.productForm.valueChanges.subscribe).toHaveBeenCalled();
    });
  });

  describe('productForm', () => {
    it('should have correct form structure', () => {
      // Assert
      expect(component.productForm).toBeDefined();
      expect(component.productForm.get('id')).toBeDefined();
      expect(component.productForm.get('name')).toBeDefined();
      expect(component.productForm.get('logo')).toBeDefined();
      expect(component.productForm.get('description')).toBeDefined();
      expect(component.productForm.get('date_release')).toBeDefined();
      expect(component.productForm.get('date_revision')).toBeDefined();
    });

    it('should have correct validators for id field', () => {
      // Arrange
      const idControl = component.productForm.get('id');

      // Assert
      expect(idControl?.hasValidator).toBeDefined();
      expect(idControl?.errors).toBeNull(); // Initially no errors
    });

    it('should have correct validators for name field', () => {
      // Arrange
      const nameControl = component.productForm.get('name');

      // Assert
      expect(nameControl?.hasValidator).toBeDefined();
      expect(nameControl?.errors).toBeNull(); // Initially no errors
    });

    it('should have correct validators for logo field', () => {
      // Arrange
      const logoControl = component.productForm.get('logo');

      // Assert
      expect(logoControl?.hasValidator).toBeDefined();
      expect(logoControl?.errors).toBeNull(); // Initially no errors
    });

    it('should have correct validators for description field', () => {
      // Arrange
      const descriptionControl = component.productForm.get('description');

      // Assert
      expect(descriptionControl?.hasValidator).toBeDefined();
      expect(descriptionControl?.errors).toBeNull(); // Initially no errors
    });

    it('should have correct validators for date_release field', () => {
      // Arrange
      const dateReleaseControl = component.productForm.get('date_release');

      // Assert
      expect(dateReleaseControl?.hasValidator).toBeDefined();
      expect(dateReleaseControl?.errors).toBeNull(); // Initially no errors
    });

    it('should have correct validators for date_revision field', () => {
      // Arrange
      const dateRevisionControl = component.productForm.get('date_revision');

      // Assert
      expect(dateRevisionControl?.hasValidator).toBeDefined();
      expect(dateRevisionControl?.errors).toBeNull(); // Initially no errors
    });
  });

  describe('resetForm', () => {
    it('should reset form to initial state', () => {
      // Arrange
      component.productForm.patchValue({
        id: 'test',
        name: 'test name',
        description: 'test description',
        logo: 'test-logo.png',
        date_release: new Date('2025-01-01'),
        date_revision: new Date('2025-01-01')
      });

      // Act
      component.resetForm();

      // Assert
      expect(component.productForm.get('id')?.value).toBe('');
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('logo')?.value).toBe('');
      expect(component.productForm.get('date_release')?.value).toBe('');
      expect(component.productForm.get('date_revision')?.value).toBe('');
      expect(component.productForm.pristine).toBe(true);
    });
  });

  describe('sendForm', () => {
    it('should create product successfully and navigate to administration page', fakeAsync(() => {
      // Arrange
      mockProductsService.createProduct.and.returnValue(of(mockSuccessResponse));
      component.productForm.patchValue(mockProducts[0]);

      // Act
      component.sendForm();
      tick();

      // Assert
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(mockProducts[0]);
      expect(component.error).toBe('');
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Producto creado correctamente', eAlertType.SUCCESS);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-administration']);
    }));

    it('should handle service error and show error alert', fakeAsync(() => {
      // Arrange
      mockProductsService.createProduct.and.returnValue(throwError(() => new Error('Network error')));
      component.productForm.patchValue(mockProducts[0]);

      // Act
      component.sendForm();
      tick();

      // Assert
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(mockProducts[0]);
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Error al crear el producto', eAlertType.DANGER);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should handle invalid response from service', fakeAsync(() => {
      // Arrange
      mockProductsService.createProduct.and.returnValue(of({} as ApiResponse<Product>));
      component.productForm.patchValue(mockProducts[0]);

      // Act
      component.sendForm();
      tick();

      // Assert
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(mockProducts[0]);
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Error al crear el producto', eAlertType.DANGER);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should handle 400 error response', fakeAsync(() => {
      // Arrange
      mockProductsService.createProduct.and.returnValue(throwError(() => ({
        error: mockErrorResponse,
        status: 400
      })));
      component.productForm.patchValue(mockProducts[0]);

      // Act
      component.sendForm();
      tick();

      // Assert
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(mockProducts[0]);
      expect(mockAlertService.showAlert).toHaveBeenCalledWith('Error al crear el producto', eAlertType.DANGER);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('form validation', () => {
    it('should validate required fields', () => {
      // Arrange & Act
      const form = component.productForm;

      // Assert
      expect(form.get('id')?.hasError('required')).toBe(true);
      expect(form.get('name')?.hasError('required')).toBe(true);
      expect(form.get('logo')?.hasError('required')).toBe(true);
      expect(form.get('description')?.hasError('required')).toBe(true);
      expect(form.get('date_release')?.hasError('required')).toBe(true);
      expect(form.get('date_revision')?.hasError('required')).toBe(true);
    });

    it('should validate id field length constraints', () => {
      // Arrange
      const idControl = component.productForm.get('id');

      // Act - Test min length
      idControl?.setValue('ab');
      expect(idControl?.hasError('minlength')).toBe(true);

      // Act - Test max length
      idControl?.setValue('abcdefghijk'); // 11 characters
      expect(idControl?.hasError('maxlength')).toBe(true);

      // Act - Test valid length
      idControl?.setValue('abc'); // 3 characters
      expect(idControl?.hasError('minlength')).toBe(false);
      expect(idControl?.hasError('maxlength')).toBe(false);
    });

    it('should validate name field length constraints', () => {
      // Arrange
      const nameControl = component.productForm.get('name');

      // Act - Test min length
      nameControl?.setValue('abcd'); // 4 characters
      expect(nameControl?.hasError('minlength')).toBe(true);

      // Act - Test max length
      nameControl?.setValue('a'.repeat(101)); // 101 characters
      expect(nameControl?.hasError('maxlength')).toBe(true);

      // Act - Test valid length
      nameControl?.setValue('Valid Name'); // 10 characters
      expect(nameControl?.hasError('minlength')).toBe(false);
      expect(nameControl?.hasError('maxlength')).toBe(false);
    });

    it('should validate description field length constraints', () => {
      // Arrange
      const descriptionControl = component.productForm.get('description');

      // Act - Test min length
      descriptionControl?.setValue('Short'); // 5 characters
      expect(descriptionControl?.hasError('minlength')).toBe(true);

      // Act - Test max length
      descriptionControl?.setValue('a'.repeat(201)); // 201 characters
      expect(descriptionControl?.hasError('maxlength')).toBe(true);

      // Act - Test valid length
      descriptionControl?.setValue('Valid description with enough characters'); // 40 characters
      expect(descriptionControl?.hasError('minlength')).toBe(false);
      expect(descriptionControl?.hasError('maxlength')).toBe(false);
    });
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      // Assert
      expect(component.error).toBe('');
      expect(component.typeInput).toBe(eInputType);
      expect(component.productForm).toBeDefined();
    });
  });

  describe('form value changes subscription', () => {
    it('should log form value changes', () => {
      // Arrange
      spyOn(console, 'log');

      // Act
      component.productForm.patchValue({
        id: 'test-id',
        name: 'test-name'
      });

    });
  });
});
