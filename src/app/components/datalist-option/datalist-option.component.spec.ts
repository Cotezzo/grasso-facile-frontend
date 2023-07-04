import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalistOptionComponent } from './datalist-option.component';

describe('DatalistOptionComponent', () => {
  let component: DatalistOptionComponent;
  let fixture: ComponentFixture<DatalistOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatalistOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalistOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
