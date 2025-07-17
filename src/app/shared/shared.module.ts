import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table.component';
import { InputComponent } from './components/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert.component';

@NgModule({
  declarations: [TableComponent, InputComponent, AlertComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [TableComponent, InputComponent, AlertComponent]
})
export class SharedModule { }
