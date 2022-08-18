import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImageRestaurantComponent } from './add-image-restaurant.component';

describe('AddImageRestaurantComponent', () => {
  let component: AddImageRestaurantComponent;
  let fixture: ComponentFixture<AddImageRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddImageRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImageRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
