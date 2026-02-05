import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IColumnDefinition } from "../../utils/models/table.interface";
import { TABLE_SIZE_PAGE_OPTIONS } from "../../utils/constants/table.constant";
import { eCellType } from "../../utils/enums/cell.enum";
import { Router } from "@angular/router";

@Component({
    selector: 'app-shared-table',
    standalone: false,
    template: `
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th *ngFor="let column of columnDefinition" class="table-header">
                            <div class="header-content">
                                <span>{{ column.name }}</span>
                                <div *ngIf="column.tooltip"
                                     [title]="getColumnTooltip(column.name)"
                                     (mouseenter)="showTooltip($event, column.name)"
                                     (mouseleave)="hideTooltip()"
                                     class="tooltip-icon">
                                    <img src="icons/information.png" alt="Info" width="16" height="16">
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody *ngIf="data.length > 0">
                    <tr *ngFor="let row of data | slice:0:tableSize" class="table-row">
                        <td *ngFor="let column of columnDefinition" class="table-cell">
                            @switch (column.type) {
                                @case (eCellType.IMAGE) {
                                    <img class="img-cell" (error)="placeholderImage(column.key)" [src]="row[column.key]" height="50" width="50" alt="Logo" />
                                }
                                @case (eCellType.STRING) {
                                    {{ row[column.key] }}
                                }
                                @case (eCellType.DATE) {
                                    {{ row[column.key] | date:'dd/MM/yyyy' }}
                                }
                                @case (eCellType.ACTIONS_NAVIGATE) {
                                    <div class="dropdown">
                                        <button type="button" class="btn-options" title="Acciones">⋮</button>
                                        <div class="dropdown-content">
                                            @for (option of column.options; track option) {
                                                @switch(option.value) {
                                                    @case('edit') {
                                                        <a href="javascript:void(0)" (click)="navigateTo(option.navigate || '', row)">{{ option.label }}</a>
                                                    }
                                                    @case('delete') {
                                                        <a href="javascript:void(0)" (click)="deleteRow(row)">{{ option.label }}</a>
                                                    }
                                                }
                                            }
                                        </div>
                                    </div>
                                }
                            }
                        </td>
                    </tr>
                </tbody>
                <tbody *ngIf="data.length === 0">
                    <tr>
                        <td [attr.colspan]="columnDefinition.length" class="no-data">
                            <div class="no-data-content">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12h6m-3-3v6m-9 1V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                </svg>
                                <p>No hay registros disponibles</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="table-footer">
                <div class="records-count">{{ displayedCount }} registros</div>
                <select *ngIf="tableSizePageOptions.length > 0" [ngModel]="tableSize" (ngModelChange)="onChangeTableSize($event)" class="page-size-select">
                    @for (option of tableSizePageOptions; track option) {
                        <option [value]="option">{{ option }}</option>
                    }
                </select>
            </div>
        </div>
    `
})
export class TableComponent {
    @Input() columnDefinition!: IColumnDefinition[];
    @Input() data: any[] = [];
    @Output() deleteRowEvent = new EventEmitter<any>();
    style: string = 'red';

    eCellType = eCellType;

    tableSizePageOptions: number[] = TABLE_SIZE_PAGE_OPTIONS;
    tableSize: number = this.tableSizePageOptions[0];

    showTooltipFlag = false;
    tooltipX = 0;
    tooltipY = 0;
    tooltipText = '';

    get displayedCount(): number {
        return Math.min(this.data.length, this.tableSize);
    }

    constructor(private router: Router) {}

    onChangeTableSize(value: number | string) {
        this.tableSize = typeof value === 'string' ? parseInt(value, 10) : value;
    }

    placeholderImage(key: string) {
        this.data.find(row => row[key])[key] = 'icons/image.png';
    }

    getColumnTooltip(columnName: string): string {
        return this.columnDefinition.find(column => column.name === columnName)?.tooltip || ``;
    }

    showTooltip(event: MouseEvent, columnName: string) {
        this.tooltipText = this.getColumnTooltip(columnName);
        this.tooltipX = event.clientX + 10;
        this.tooltipY = event.clientY - 30;
        this.showTooltipFlag = true;
    }

    hideTooltip() {
        this.showTooltipFlag = false;
    }

    navigateTo(_route: string, rowData: any) {
        this.router.navigate(['/product-administration/create'], { state: rowData });
    }

    deleteRow(rowData: any) {
        this.deleteRowEvent.emit(rowData);
    }
}