import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routerStub;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
