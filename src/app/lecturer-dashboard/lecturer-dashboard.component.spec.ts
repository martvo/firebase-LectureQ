import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { LecturerDashboardComponent } from './lecturer-dashboard.component';

describe('LecturerDashboardComponent', () => {
  let component: LecturerDashboardComponent;
  let fixture: ComponentFixture<LecturerDashboardComponent>;
  let routerStub;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [ LecturerDashboardComponent ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
