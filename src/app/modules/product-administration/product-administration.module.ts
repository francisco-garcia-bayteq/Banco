import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductAdministrationPageComponent } from './pages/product-administration-page/product-administration-page.component';
import { ProductCreationPageComponent } from './pages/product-creation-page/product-creation-page.component';
import { ErrorInterceptor } from '../../core/interceptors/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    ProductAdministrationPageComponent,
    ProductCreationPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class ProductAdministrationModule { }
