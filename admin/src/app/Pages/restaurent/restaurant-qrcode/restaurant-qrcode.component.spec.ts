import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantQrcodeComponent } from './restaurant-qrcode.component';

describe('RestaurantQrcodeComponent', () => {
  let component: RestaurantQrcodeComponent;
  let fixture: ComponentFixture<RestaurantQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
