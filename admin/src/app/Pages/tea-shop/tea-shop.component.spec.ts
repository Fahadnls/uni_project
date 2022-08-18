import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaShopComponent } from './tea-shop.component';

describe('TeaShopComponent', () => {
  let component: TeaShopComponent;
  let fixture: ComponentFixture<TeaShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeaShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeaShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
