import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdministrationPageComponent } from './product-administration-page.component';

describe('ProductAdministrationPageComponent', () => {
  let component: ProductAdministrationPageComponent;
  let fixture: ComponentFixture<ProductAdministrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAdministrationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAdministrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
