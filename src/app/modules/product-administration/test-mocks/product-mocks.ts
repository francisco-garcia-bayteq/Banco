import { Product } from '../../../utils/models/product.interface';
import { ApiResponse } from '../../../utils/models/api.interface';

export const mockProducts: Product[] = [
  {
    id: 'uno',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'assets-1.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2025-01-01')
  },
  {
    id: 'dos',
    name: 'Otro producto',
    description: 'Otra descripción',
    logo: 'assets-2.png',
    date_release: new Date('2025-02-01'),
    date_revision: new Date('2025-02-01')
  },
  {
    id: 'tres',
    name: 'Producto premium',
    description: 'Descripción del producto premium con más detalles',
    logo: 'assets-3.png',
    date_release: new Date('2025-03-01'),
    date_revision: new Date('2025-03-01')
  }
];

// Mock de respuesta exitosa para GET /bp/products
export const mockGetProductsResponse: ApiResponse<Product[]> = {
  data: mockProducts
};

// Mock de producto para creación
export const mockProductForCreation: Product = {
  id: 'nuevo',
  name: 'Nuevo producto',
  description: 'Descripción del nuevo producto',
  logo: 'assets-nuevo.png',
  date_release: new Date('2025-01-01'),
  date_revision: new Date('2025-01-01')
};

// Mock de respuesta exitosa para POST /bp/products
export const mockCreateProductResponse: ApiResponse<Product> = {
  message: 'Product added successfully',
  data: mockProductForCreation
};

// Mock de respuesta exitosa para PUT /bp/products/:id
export const mockUpdateProductResponse: ApiResponse<Product> = {
  message: 'Product updated successfully',
  data: {
    ...mockProductForCreation,
    name: 'Nombre actualizado'
  }
};

// Mock de respuesta de error 400
export const mockBadRequestError = {
  name: 'BadRequestError',
  message: 'Invalid body, check \'errors\' property for more info.',
  errors: [
    {
      field: 'name',
      message: 'Name is required'
    }
  ]
};

// Mock de respuesta de error 404
export const mockNotFoundError = {
  name: 'NotFoundError',
  message: 'Not product found with that identifier'
};

// Mock de respuesta de error 500
export const mockServerError = {
  name: 'InternalServerError',
  message: 'Internal server error'
};

// Factory para crear mocks de productos
export class ProductMockFactory {
  static createProduct(overrides: Partial<Product> = {}): Product {
    return {
      id: 'test-id',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date('2025-01-01'),
      date_revision: new Date('2025-01-01'),
      ...overrides
    };
  }

  static createProducts(count: number): Product[] {
    return Array.from({ length: count }, (_, index) => 
      this.createProduct({
        id: `product-${index + 1}`,
        name: `Product ${index + 1}`,
        description: `Description for product ${index + 1}`
      })
    );
  }

  static createApiResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      data,
      message
    };
  }
}

// Mocks para diferentes escenarios de error
export const mockErrorScenarios = {
  networkError: new Error('Network error'),
  timeoutError: new Error('Request timeout'),
  serverError: {
    error: mockServerError,
    status: 500
  },
  badRequestError: {
    error: mockBadRequestError,
    status: 400
  },
  notFoundError: {
    error: mockNotFoundError,
    status: 404
  }
}; 