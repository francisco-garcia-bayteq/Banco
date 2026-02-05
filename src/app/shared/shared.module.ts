import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table.component';
import { InputComponent } from './components/input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert.component';
import { SkeletonComponent } from './components/skeleton.component';

@NgModule({
  declarations: [TableComponent, InputComponent, AlertComponent, SkeletonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [TableComponent, InputComponent, AlertComponent, SkeletonComponent]
})
export class SharedModule { }
