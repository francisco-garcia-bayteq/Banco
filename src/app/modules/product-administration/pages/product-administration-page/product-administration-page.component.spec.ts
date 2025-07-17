import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductAdministrationPageComponent } from './product-administration-page.component';
import { ProductsService } from '../../../../services/products.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Product } from '../../../../utils/models/product.interface';
import { ApiResponse } from '../../../../utils/models/api.interface';
import { eCellType } from '../../../../utils/enums/cell.enum';
import { eInputType } from '../../../../utils/enums/input.enum';
import { mockProducts, mockGetProductsResponse, mockErrorScenarios } from '../../test-mocks/product-mocks';
import { TableComponent } from '../../../../shared/components/table.component';
import { InputComponent } from '../../../../shared/components/input.component';
import { AlertComponent } from '../../../../shared/components/alert.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductAdministrationPageComponent', () => {
  let component: ProductAdministrationPageComponent;
  let fixture: ComponentFixture<ProductAdministrationPageComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFormBuilder: jasmine.SpyObj<FormBuilder>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getProducts']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['group']);

    await TestBed.configureTestingModule({
      declarations: [ 
        ProductAdministrationPageComponent,
        TableComponent,
        InputComponent,
        AlertComponent
      ],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: FormBuilder, useValue: formBuilderSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    mockProductsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockFormBuilder = TestBed.inject(FormBuilder) as jasmine.SpyObj<FormBuilder>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdministrationPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and load products successfully', fakeAsync(() => {
      mockProductsService.getProducts.and.returnValue(of(mockGetProductsResponse));
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['get']);
      mockFormGroup.get.and.returnValue({
        valueChanges: of('')
      });
      mockFormBuilder.group.and.returnValue(mockFormGroup);

      component.ngOnInit();
      tick();

      expect(mockProductsService.getProducts).toHaveBeenCalled();
      expect(component.products).toEqual(mockProducts);
      expect(component.productsFiltered).toEqual(mockProducts);
      expect(component.error).toBe('');
      expect(mockFormBuilder.group).toHaveBeenCalled();
    }));

    it('should handle error when loading products fails', fakeAsync(() => {
      mockProductsService.getProducts.and.returnValue(throwError(() => new Error('Network error')));
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['get']);
      mockFormGroup.get.and.returnValue({
        valueChanges: of('')
      });
      mockFormBuilder.group.and.returnValue(mockFormGroup);

      component.ngOnInit();
      tick();

      expect(component.error).toBe('No se pudieron cargar los productos');
      expect(component.products).toEqual([]);
      expect(component.productsFiltered).toEqual([]);
    }));

    it('should handle invalid response from service', fakeAsync(() => {
      mockProductsService.getProducts.and.returnValue(of({} as ApiResponse<Product[]>));
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['get']);
      mockFormGroup.get.and.returnValue({
        valueChanges: of('')
      });
      mockFormBuilder.group.and.returnValue(mockFormGroup);

      component.ngOnInit();
      tick();

      expect(component.error).toBe('No se pudieron cargar los productos');
      expect(component.products).toEqual([]);
      expect(component.productsFiltered).toEqual([]);
    }));
  });

  describe('columnDefinition', () => {
    it('should have correct column definitions', () => {
      expect(component.columnDefinition).toBeDefined();
      expect(component.columnDefinition.length).toBe(6);
      
      expect(component.columnDefinition[0]).toEqual({
        name: 'Logo',
        key: 'logo',
        type: eCellType.IMAGE
      });

      expect(component.columnDefinition[1]).toEqual({
        name: 'Nombre del producto',
        key: 'name',
        type: eCellType.STRING
      });

      expect(component.columnDefinition[2]).toEqual({
        name: 'Descripción',
        key: 'description',
        type: eCellType.STRING,
        tooltip: 'Descripción del producto'
      });

      expect(component.columnDefinition[3]).toEqual({
        name: 'Fecha de liberación',
        key: 'date_release',
        type: eCellType.DATE,
        tooltip: 'Fecha de liberación del producto'
      });

      expect(component.columnDefinition[4]).toEqual({
        name: 'Fecha de reestructuración',
        key: 'date_revision',
        type: eCellType.DATE,
        tooltip: 'Fecha de reestructuración del producto'
      });

      expect(component.columnDefinition[5]).toEqual({
        name: '',
        key: 'actions',
        type: eCellType.ACTIONS_NAVIGATE,
        options: [
          { label: 'Editar', value: 'edit', navigate: '/create', data: { id: 'id' } }
        ]
      });
    });
  });

  describe('filterProducts', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.productsFiltered = [...mockProducts];
    });

    it('should show all products when search is empty', () => {
      component.search = '';

      component.filterProducts();

      expect(component.productsFiltered).toEqual(mockProducts);
    });

    it('should show all products when search is only whitespace', () => {
      component.search = '   ';

      component.filterProducts();

      expect(component.productsFiltered).toEqual(mockProducts);
    });

    it('should filter products by name (case insensitive)', () => {
      component.search = 'nombre';

      component.filterProducts();

      expect(component.productsFiltered.length).toBe(1);
      expect(component.productsFiltered[0].name).toBe('Nombre producto');
    });

    it('should filter products by partial name match', () => {
      component.search = 'otro';

      component.filterProducts();

      expect(component.productsFiltered.length).toBe(1);
      expect(component.productsFiltered[0].name).toBe('Otro producto');
    });

    it('should return empty array when no products match search', () => {
      component.search = 'producto inexistente';

      component.filterProducts();

      expect(component.productsFiltered.length).toBe(0);
    });
  });

  describe('addProduct', () => {
    it('should navigate to product creation page', () => {
      component.addProduct();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-administration/create']);
    });
  });

  describe('initialData', () => {
    it('should load products successfully', fakeAsync(() => {
      mockProductsService.getProducts.and.returnValue(of(mockGetProductsResponse));

      component.initialData();
      tick();

      expect(mockProductsService.getProducts).toHaveBeenCalled();
      expect(component.products).toEqual(mockProducts);
      expect(component.productsFiltered).toEqual(mockProducts);
      expect(component.error).toBe('');
    }));

    it('should handle service error', fakeAsync(() => {
      mockProductsService.getProducts.and.returnValue(throwError(() => new Error('Network error')));

      component.initialData();
      tick();

      expect(component.error).toBe('No se pudieron cargar los productos');
      expect(component.products).toEqual([]);
      expect(component.productsFiltered).toEqual([]);
    }));

    it('should handle invalid response structure', fakeAsync(() => {
      mockProductsService.getProducts.and.returnValue(of({} as ApiResponse<Product[]>));

      component.initialData();
      tick();

      expect(component.error).toBe('No se pudieron cargar los productos');
      expect(component.products).toEqual([]);
      expect(component.productsFiltered).toEqual([]);
    }));
  });

  describe('initForm', () => {
    it('should initialize form with search control', () => {
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['get']);
      mockFormGroup.get.and.returnValue({
        valueChanges: of('test search')
      });
      mockFormBuilder.group.and.returnValue(mockFormGroup);

      component.initForm();

      expect(mockFormBuilder.group).toHaveBeenCalled();
      expect(mockFormGroup.get).toHaveBeenCalledWith('search');
    });

    it('should subscribe to search value changes', fakeAsync(() => {
      const mockValueChanges = of('test search');
      const mockFormGroup = jasmine.createSpyObj('FormGroup', ['get']);
      mockFormGroup.get.and.returnValue({
        valueChanges: mockValueChanges
      });
      mockFormBuilder.group.and.returnValue(mockFormGroup);

      component.initForm();
      tick();

      expect(component.search).toBe('test search');
    }));
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      expect(component.products).toEqual([]);
      expect(component.search).toBe('');
      expect(component.productsFiltered).toEqual([]);
      expect(component.error).toBe('');
      expect(component.typeInput).toBe(eInputType);
    });
  });
});
