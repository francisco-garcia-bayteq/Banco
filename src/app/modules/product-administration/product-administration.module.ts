import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductAdministrationPageComponent } from './pages/product-administration-page/product-administration-page.component';
import { ProductCreationPageComponent } from './pages/product-creation-page/product-creation-page.component';

@NgModule({
  declarations: [
    ProductAdministrationPageComponent,
    ProductCreationPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProductAdministrationModule { }
