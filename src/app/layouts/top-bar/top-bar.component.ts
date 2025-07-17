import { Component } from '@angular/core';

@Component({
  selector: 'top-bar',
  standalone: false,
  template: `
    <div class="top-bar">
      <div class="logo" >
        <img src="icons/logo.png" alt="Logo del banco">
      </div>
      <div class="bank-name">
        BANCO
      </div>
    </div>
  `,
  styles: [`
    
  `]
})
export class TopBarComponent {

}