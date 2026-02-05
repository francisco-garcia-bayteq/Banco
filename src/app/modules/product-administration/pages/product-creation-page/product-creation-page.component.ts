import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { eInputType } from '../../../../utils/enums/input.enum';
import { isDateGreaterThanCurrent, isDateRevisionOneYearAfterRelease } from '../../../../utils/validators/input.validator';
import { ProductsService } from '../../../../services/products.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { eAlertType } from '../../../../utils/enums/alert.enum';
import { ApiResponse } from '../../../../utils/models/api.interface';
import { Product } from '../../../../utils/models/product.interface';

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
    date_revision: new FormControl('', { validators: [Validators.required, isDateRevisionOneYearAfterRelease] })
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
    const state = history?.state || null;
    if (state?.id) {
      this.productForm.patchValue(state);
      this.editMode = true;
      this.productForm.get('id')?.disable();
    } else {
      this.setRevisionDate();
      this.productForm.get('date_release')?.valueChanges.subscribe((value) => {
        if (value) {
          const d = new Date(value);
          d.setFullYear(d.getFullYear() + 1);
          this.productForm.get('date_revision')?.setValue(d.toISOString().split('T')[0]);
        }
      });
    }
  }

  setRevisionDate() {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    this.productForm.get('date_revision')?.setValue(nextYear.toISOString().split('T')[0]);
    this.productForm.get('date_revision')?.disable();
  }

  resetForm() {
    this.productForm.reset();
    this.productForm.updateValueAndValidity();
    this.productForm.markAsPristine();
  }


  getFormValues(): any {
    const formValues = this.productForm.value;
    const disabledValues: any = {};

    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control?.disabled) {
        disabledValues[key] = control.value;
      }
    });

    return { ...formValues, ...disabledValues };
  }

  async sendForm() {
    const id = this.productForm.get('id')?.value;
    let response: ApiResponse<Product>;
    try {
      if (!this.editMode) {
        await this.verifyId(id);
      }
      const formData = this.getFormValues();

      if (this.editMode) {
        response = await firstValueFrom(this._productService.updateProduct(formData));
      } else {
        response = await firstValueFrom(this._productService.createProduct(formData));
      }

      if (response && response.data) {
        this.error = '';
        this._alertService.showConfirmAlert(
          this.editMode ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
          eAlertType.SUCCESS,
          () => this._router.navigate(['/product-administration'])
        );
      } else {
        this._alertService.showAlert('Error al crear el producto' + response.message, eAlertType.DANGER);
      }
    } catch (error) {
      this._alertService.showAlert('Error al crear el producto ' + ((error as any).error.message ?? 'Error desconocido'), eAlertType.DANGER);
    }
  }

  async verifyId(id: string): Promise<boolean> {
    const response = await firstValueFrom(this._productService.verifyId(id));
    if (response) {
      const error = {
        error: { message: 'El ID ya existe' }
      }
      throw error;
    }
    return false;
  }
}
