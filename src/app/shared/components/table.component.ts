import { Component, Input } from "@angular/core";
import { IColumnDefinition } from "../../utils/models/table.interface";
import { TABLE_SIZE_PAGE_OPTIONS } from "../../utils/constants/table.constant";
import { eCellType } from "../../utils/enums/cell.enum";

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
                                     (mouseleave)="hideTooltip()">
                                    <img style="margin-top: 5px;" src="icons/info.png" alt="Info" width="25" height="25">
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
                                    <img class="img-cell" [src]="row[column.key]" height="50" width="50" alt="Logo" />
                                }
                                @case (eCellType.STRING) {
                                    {{ row[column.key] }}
                                }
                                @case (eCellType.DATE) {
                                    {{ row[column.key] | date:'dd/MM/yyyy' }}
                                }
                            }
                        </td>
                    </tr>
                </tbody>
                <tbody *ngIf="data.length === 0">
                    <tr>
                        <td colspan="100%" class="no-data">No hay registros</td>
                    </tr>
                </tbody>
            </table>
            <div class="table-footer">
                <div class="records-count">{{ data.length }} registros</div>
                <select *ngIf="tableSizePageOptions.length > 0" (change)="onChangeTableSize($event)" class="page-size-select">
                    @for (option of tableSizePageOptions; track option) {
                        <option value="{{ option }}">{{ option }}</option>
                    }
                </select>
            </div>
        </div>
    `
})
export class TableComponent {
    @Input() columnDefinition!: IColumnDefinition[];
    @Input() data: any[] = [];

    eCellType = eCellType;

    tableSizePageOptions: number[] = TABLE_SIZE_PAGE_OPTIONS;
    tableSize: number = this.tableSizePageOptions[0];

    // Tooltip properties
    showTooltipFlag = false;
    tooltipX = 0;
    tooltipY = 0;
    tooltipText = '';

    onChangeTableSize(event: Event) {
        const target = event.target as HTMLSelectElement;
        const value = parseInt(target.value);
        this.tableSize = value;
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
}