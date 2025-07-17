import { Component, Input } from "@angular/core";
import { IColumnDefinition } from "../../utils/models/table.interface";
import { TABLE_SIZE_PAGE_OPTIONS } from "../../utils/constants/table.constant";
import { eCellType } from "../../utils/enums/cell.enum";

@Component({
    selector: 'app-shared-table',
    standalone: false,
    template: `
        <table>
            <thead>
                <tr>
                    <th *ngFor="let column of columnDefinition">{{ column.name }}</th>
                </tr>
            </thead>
            <tbody *ngIf="data.length > 0">
                <tr *ngFor="let row of data | slice:0:tableSize">
                    <td *ngFor="let column of columnDefinition">
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
                    <td>No hay registros</td>
                </tr>
            </tbody>
        </table>
        <div>
            <div>{{ data.length }} registros</div>
            <select *ngIf="tableSizePageOptions.length > 0" (change)="onChangeTableSize($event)">
                @for (option of tableSizePageOptions; track option) {
                    <option value="{{ option }}">{{ option }}</option>
                }
            </select>
            
        </div>
    `
})
export class TableComponent {
    @Input() columnDefinition!: IColumnDefinition[];
    @Input() data: any[] = [];

    eCellType = eCellType;

    tableSizePageOptions: number[] = TABLE_SIZE_PAGE_OPTIONS;
    tableSize: number = this.tableSizePageOptions[0];

    onChangeTableSize(event: Event) {
        const target = event.target as HTMLSelectElement;
        const value = parseInt(target.value);
        this.tableSize = value;
    }
}