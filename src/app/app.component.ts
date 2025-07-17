import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutsModule } from './layouts/top-bar/layouts.module';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutsModule, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'banco';
}
