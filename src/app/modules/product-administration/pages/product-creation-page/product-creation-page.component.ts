import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { eInputType } from '../../../../utils/enums/input.enum';
import { isDateGreaterThanCurrent, isDateNYearsAfterCurrent } from '../../../../utils/validators/input.validator';
import { ProductsService } from '../../../../services/products.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { eAlertType } from '../../../../utils/enums/alert.enum';

@Component({
  selector: 'app-product-creation-page',
  standalone: false,
  templateUrl: './product-creation-page.component.html'
})
export class ProductCreationPageComponent implements OnInit {
  productForm: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    name: new FormControl('', { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100)] }),
    logo: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)] }),
    date_release: new FormControl('', { validators: [Validators.required, isDateGreaterThanCurrent()] }),
    date_revision: new FormControl('', { validators: [Validators.required, isDateNYearsAfterCurrent(1)] })
  });

  error: string = '';
  editMode: boolean = false;

  typeInput = eInputType;

  constructor(
    private _productService: ProductsService,
    private _router: Router,
    private _alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    const state = history.state;
    if (state) {
      this.productForm.patchValue(state);
      this.editMode = true;
    }
    this.productForm.valueChanges.subscribe((value) => {
    });
  }

  resetForm() {
    this.productForm.reset();
    this.productForm.updateValueAndValidity();
    this.productForm.markAsPristine();
  }

  async sendForm() {
    try {
      const response = await firstValueFrom(this._productService.createProduct(this.productForm.value));
      
      if (response && response.data) {
        this.error = '';
        this._alertService.showConfirmAlert(
          'Producto creado correctamente', 
          eAlertType.SUCCESS,
          () => {
            this._router.navigate(['/product-administration']);
          }
        );
      } else {
        this._alertService.showAlert('Error al crear el producto', eAlertType.DANGER);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      this._alertService.showAlert('Error al crear el producto', eAlertType.DANGER);
    }
  }
}
