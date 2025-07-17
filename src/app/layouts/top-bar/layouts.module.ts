import { NgModule } from "@angular/core";
import { TopBarComponent } from "./top-bar.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [TopBarComponent],
  imports: [CommonModule],
  exports: [TopBarComponent]
})
export class LayoutsModule { }