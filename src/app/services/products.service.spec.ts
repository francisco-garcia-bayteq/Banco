import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../utils/models/product.interface';
import { ApiResponse } from '../utils/models/api.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 'test-id',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2025-01-01')
  };

  const mockApiResponse: ApiResponse<Product[]> = {
    data: [mockProduct]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products from API', () => {
      service.getProducts().subscribe(response => {
        expect(response).toEqual(mockApiResponse);
      });

      const req = httpMock.expectOne(`${service.getApiBaseUrl()}/bp/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });
  });

  describe('createProduct', () => {
    it('should create product via API', () => {
      const createResponse: ApiResponse<Product> = {
        message: 'Product created successfully',
        data: mockProduct
      };

      service.createProduct(mockProduct).subscribe(response => {
        expect(response).toEqual(createResponse);
      });

      const req = httpMock.expectOne(`${service.getApiBaseUrl()}/bp/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(createResponse);
    });
  });

  describe('updateProduct', () => {
    it('should update product via API', () => {
      const updateResponse: ApiResponse<Product> = {
        message: 'Product updated successfully',
        data: mockProduct
      };

      service.updateProduct(mockProduct).subscribe(response => {
        expect(response).toEqual(updateResponse);
      });

      const req = httpMock.expectOne(`${service.getApiBaseUrl()}/bp/products/${mockProduct.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(updateResponse);
    });
  });

  describe('API base URL', () => {
    it('should have correct API base URL', () => {
      const baseUrl = service.getApiBaseUrl();
      expect(baseUrl).toBeDefined();
      expect(typeof baseUrl).toBe('string');
    });
  });

  describe('headers', () => {
    it('should have correct headers', () => {
      const headers = service.getHeaders();
      expect(headers).toBeDefined();
      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });
}); 