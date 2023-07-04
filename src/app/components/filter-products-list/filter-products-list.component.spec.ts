import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProductsListComponent } from './filter-products-list.component';

describe('FilterProductsListComponent', () => {
  let component: FilterProductsListComponent;
  let fixture: ComponentFixture<FilterProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProductsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
