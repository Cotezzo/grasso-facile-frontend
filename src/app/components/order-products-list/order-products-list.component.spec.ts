import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProductsListComponent } from './order-products-list.component';

describe('OrderProductsListComponent', () => {
  let component: OrderProductsListComponent;
  let fixture: ComponentFixture<OrderProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderProductsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
