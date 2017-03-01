import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistratioPageComponent } from './registratio-page.component';

describe('RegistratioPageComponent', () => {
  let component: RegistratioPageComponent;
  let fixture: ComponentFixture<RegistratioPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistratioPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistratioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
