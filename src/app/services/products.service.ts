import { Injectable } from "@angular/core";
import { Product } from "../utils/models/product.interface";
import { AplicationService } from "../utils/base/aplication.service";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../utils/models/api.interface";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class ProductsService extends AplicationService {

	constructor(private _http: HttpClient) {
		super();
	}

	getProducts(): Observable<ApiResponse<Product[]>> {
		return this._http.get<ApiResponse<Product[]>>(`${this.getApiBaseUrl()}/bp/products`, { headers: this.getHeaders() });
	}

    createProduct(product: Product): Observable<ApiResponse<Product>> {
        return this._http.post<ApiResponse<Product>>(`${this.getApiBaseUrl()}/bp/products`, product, { headers: this.getHeaders() });
    }

    updateProduct(product: Product): Observable<ApiResponse<Product>> {
        return this._http.put<ApiResponse<Product>>(`${this.getApiBaseUrl()}/bp/products/${product.id}`, product, { headers: this.getHeaders() });
    }
    
}
