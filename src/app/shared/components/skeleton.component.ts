import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-skeleton',
  standalone: false,
  template: `
    <div class="skeleton-container">
      <div class="skeleton-item" *ngFor="let column of getColumns(); let i = index">
        <div class="skeleton-item-content" *ngFor="let row of getRows(); let j = index">
          <div class="skeleton-item-content-item" [ngClass]="{'skeleton-item-content-item-last': j === rows - 1, 'skeleton-item-content-item-first': j === 0}"></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes shine {
        to {
          background-position: right -40px top 0;
        }
      }

      .skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .skeleton-item {
        width: 100%;
        height: 5%;
        gap: 10px;
        display: flex;
      }
      .skeleton-item-content {
        width: 100%;
        height: 100%;
        background-color: rgb(210, 210, 210);
      }
      .skeleton-item-content-item {
        width: 100%;
        height: 30px;
        background-color: #f0f0f0;
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.6) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 40px 100%;
        background-repeat: no-repeat;
        background-position: left -40px top 0;
        animation: shine 1s ease infinite;
      }
    `
  ]
})
export class SkeletonComponent {

    @Input() columns: number = 1;
    @Input() rows: number = 1;

    getColumns(): number[] {
        return Array.from({ length: this.rows }, (_, i) => i);
    }

    getRows(): number[] {
        return Array.from({ length: this.columns }, (_, i) => i);
    }
}