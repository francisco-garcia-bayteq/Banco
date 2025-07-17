import { Component, OnInit } from '@angular/core';
import { IColumnDefinition } from '../../../../utils/models/table.interface';
import { ProductsService } from '../../../../services/products.service';
import { Product } from '../../../../utils/models/product.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { eCellType } from '../../../../utils/enums/cell.enum';

@Component({
	selector: 'app-product-administration-page',
	standalone: false,
	templateUrl: './product-administration-page.component.html',
})
export class ProductAdministrationPageComponent implements OnInit {
	columnDefinition: IColumnDefinition[] = [
		{ name: 'Logo', key: 'logo', type: eCellType.IMAGE },
		{ name: 'Nombre del producto', key: 'name', type: eCellType.STRING },
		{ name: 'Descripción', key: 'description', type: eCellType.STRING },
		{ name: 'Fecha de liberación', key: 'date_release', type: eCellType.DATE },
		{ name: 'Fecha de reestructuración', key: 'date_revision', type: eCellType.DATE },
	];

	products: Product[] = [];
	search: string = '';
	productForm!: FormGroup;
	productsFiltered: Product[] = [];
	error: string = '';

	constructor(
		private _productService: ProductsService,
		private _router: Router,
		private _formBuilder: FormBuilder
	) {
	}

	async ngOnInit() {
		await this.initialData();
		this.initForm();
	}

	async initialData() {
		this.error = '';

		const response = await firstValueFrom(this._productService.getProducts());

		if (response && response.data) {
			this.products = response.data;
			this.productsFiltered = [...this.products]; // Inicializar con todos los productos
			console.log('Productos cargados:', this.products);
		} else {
			console.error('Respuesta inválida del servicio:', response);
			this.error = 'No se pudieron cargar los productos';
		}
	}

	initForm() {
		this.productForm = this._formBuilder.group({
			search: [''],
		});

		this.productForm.get('search')?.valueChanges.subscribe((value) => {
			this.search = value;
			this.filterProducts();
		});
	}

	filterProducts() {
		if (!this.search || this.search.trim() === '') {
			this.productsFiltered = [...this.products];
		} else {
			this.productsFiltered = this.products.filter((product) =>
				product.name.toLowerCase().includes(this.search.toLowerCase())
			);
		}
	}

	addProduct() {
		this._router.navigate(['/product-administration/create']);
	}
}