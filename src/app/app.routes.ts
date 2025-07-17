import { Routes } from '@angular/router';
import { ProductAdministrationPageComponent } from './modules/product-administration/pages/product-administration-page/product-administration-page.component';
import { ProductCreationPageComponent } from './modules/product-administration/pages/product-creation-page/product-creation-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/product-administration', pathMatch: 'full' },
  { path: 'product-administration', component: ProductAdministrationPageComponent },
  { path: 'product-administration/create', component: ProductCreationPageComponent }
];
