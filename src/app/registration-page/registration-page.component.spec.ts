import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { } from 'jasmine';

import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check two unequal passwords', () => {
    // Act
    var x = component.checkPassword("martin", "Martin")

    // Assert
    expect(x).toBeFalsy();
  });

  it('should check two equal passwords', () => {
    // Act
    var x = component.checkPassword("martin", "martin")

    // Assert
    expect(x).toBeTruthy();
  })
});
