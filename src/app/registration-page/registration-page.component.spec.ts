import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
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

  it('should not do anything if passwords are unequal', fakeAsync(() => {
    component.register(new Event(null), 'martin', 'martin@martin.com', 'Martin', 'martin', false);
    tick(500)
    expect(routerStub.navigate).not.toHaveBeenCalled();
  }))

  it('should navigate to lecturerDashboard, no error caught', fakeAsync(() => {
    component.register(new Event(null), 'martin', 'martin@martin.com', 'martin', 'martin', true);
    tick(500);
    expect(routerStub.navigate).toHaveBeenCalledWith(['lecturerDashboard']);
    expect(component.error).toBeUndefined();
  }))

  it('should navigate to studentDashboard, no error caught', fakeAsync(() => {
    component.register(new Event(null), 'martin', 'martin@martin.com', 'martin', 'martin', false);
    tick(500);
    expect(routerStub.navigate).toHaveBeenCalledWith(['studentDashboard']);
    expect(component.error).toBeUndefined();
  }))

});
