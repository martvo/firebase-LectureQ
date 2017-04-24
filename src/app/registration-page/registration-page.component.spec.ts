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

  it('should route to studentDashboard, when passwords are equal', async(() => {
    component.register(new Event(null), 'martin', 'martin@martin.com', 'martin', 'martin', false);
    expect(routerStub.navigate).toHaveBeenCalledWith(['studentDashboard']);
    })
  )

  it('should route to studentDashboard, when passwords are equal', () => {

  })

  it('should route to studentDashboard, when passwords are equal', () => {

  })

  it('should route to studentDashboard, when passwords are equal', () => {

  })

});
