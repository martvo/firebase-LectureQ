import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { } from 'jasmine';

import { Router } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let routerStub;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [ RegistrationPageComponent ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
      ],
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
    // Act and Assert
    expect(component.checkPassword("martin", "Martin")).toBeFalsy();
  });

  it('should check two equal passwords', () => {
    // Act and Assert
    expect(component.checkPassword("martin", "martin")).toBeTruthy();
  })

  it('error variable should be undefined', () => {
    expect(component.error).toBeUndefined();
  })

  it('should not do anything if passwords are unequal', () => {
    component.register(new Event(null), 'martin', 'martin@martin.com', 'Martin', 'martin', false);
    expect(routerStub.navigate).not.toHaveBeenCalled();
  })

  it('error variable should not be equal to undefined, when registrerUser methond returns unexpected Promise', () => {
    component.register(new Event(null), 'martin', 'martin@martin.com', 'martin', 'martin', false);
    expect(component.error).not.toBeUndefined();
  })


});
