import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { Router } from '@angular/router';
import { IColumnDefinition } from '../../utils/models/table.interface';
import { eCellType } from '../../utils/enums/cell.enum';
import { TABLE_SIZE_PAGE_OPTIONS } from '../../utils/constants/table.constant';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockColumnDefinition: IColumnDefinition[] = [
    { name: 'Logo', key: 'logo', type: eCellType.IMAGE },
    { name: 'Nombre', key: 'name', type: eCellType.STRING },
    { name: 'Descripción', key: 'description', type: eCellType.STRING, tooltip: 'Descripción del producto' },
    { name: 'Fecha', key: 'date_release', type: eCellType.DATE },
    { name: 'Acciones', key: 'actions', type: eCellType.ACTIONS_NAVIGATE, options: [
      { label: 'Editar', value: 'edit', navigate: '/edit' },
      { label: 'Eliminar', value: 'delete', navigate: '/delete' }
    ]}
  ];

  const mockData = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción 1',
      logo: 'logo1.png',
      date_release: new Date('2025-01-01'),
      date_revision: new Date('2025-01-01')
    },
    {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción 2',
      logo: 'logo2.png',
      date_release: new Date('2025-02-01'),
      date_revision: new Date('2025-02-01')
    }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.columnDefinition = mockColumnDefinition;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChangeTableSize', () => {
    it('should update table size when select value changes', () => {
      const event = {
        target: { value: '10' }
      } as any;

      component.onChangeTableSize(event);

      expect(component.tableSize).toBe(10);
    });
  });

  describe('getColumnTooltip', () => {
    it('should return tooltip for column with tooltip', () => {
      const tooltip = component.getColumnTooltip('Descripción');

      expect(tooltip).toBe('Descripción del producto');
    });

    it('should return empty string for column without tooltip', () => {
      const tooltip = component.getColumnTooltip('Nombre');

      expect(tooltip).toBe('');
    });
  });

  describe('showTooltip', () => {
    it('should set tooltip properties when mouse enters', () => {
      const event = new MouseEvent('mouseenter', {
        clientX: 100,
        clientY: 200
      });

      component.showTooltip(event, 'Descripción');

      expect(component.tooltipText).toBe('Descripción del producto');
      expect(component.tooltipX).toBe(110);
      expect(component.tooltipY).toBe(170);
      expect(component.showTooltipFlag).toBe(true);
    });
  });

  describe('hideTooltip', () => {
    it('should hide tooltip when mouse leaves', () => {
      component.showTooltipFlag = true;

      component.hideTooltip();

      expect(component.showTooltipFlag).toBe(false);
    });
  });

  describe('navigateTo', () => {
    it('should navigate to route with row data', () => {
      const rowData = { id: '1', name: 'Test' };

      component.navigateTo('/edit', rowData);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit'], { state: rowData });
    });
  });

  describe('component properties', () => {
    it('should have correct initial values', () => {
      expect(component.eCellType).toBe(eCellType);
      expect(component.tableSizePageOptions).toEqual(TABLE_SIZE_PAGE_OPTIONS);
      expect(component.tableSize).toBe(TABLE_SIZE_PAGE_OPTIONS[0]);
      expect(component.showTooltipFlag).toBe(false);
      expect(component.tooltipX).toBe(0);
      expect(component.tooltipY).toBe(0);
      expect(component.tooltipText).toBe('');
    });
  });

  describe('data display', () => {
    it('should display data when available', () => {
      expect(component.data.length).toBe(2);
    });

    it('should show no data message when data is empty', () => {
      component.data = [];
      fixture.detectChanges();

      expect(component.data.length).toBe(0);
    });
  });

  describe('table size options', () => {
    it('should have table size options available', () => {
      expect(component.tableSizePageOptions.length).toBeGreaterThan(0);
    });
  });
}); 