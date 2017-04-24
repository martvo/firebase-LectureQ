import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { StudentDashboardComponent } from './student-dashboard.component';

describe('StudentDashboardComponent', () => {
  let component: StudentDashboardComponent;
  let fixture: ComponentFixture<StudentDashboardComponent>;
  let routerStub;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [ StudentDashboardComponent ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('student variable "searchedCourses" should be undefined', () => {
    expect(component.searchedCourses).toBeUndefined();
  })

  it('search for "tdt" should contain TDT4000', () => {
    component.searchForCourse("tdt");
    expect(component.searchedCourses).toContain("TDT4000");
  })

  it('search for "tdt" should contain TDT4001', () => {
    component.searchForCourse("tdt");
    expect(component.searchedCourses).toContain("TDT4001");
  })

  it('search for "tdt" should contain TDT4002', () => {
    component.searchForCourse("tdt");
    expect(component.searchedCourses).toContain("TDT4002");
  })

  it('search for "TMM" should set var "searchedCourses" equal to an empty list', () => {
    component.searchForCourse("TMM");
    expect(component.searchedCourses).toEqual([]);
  })

  it('should redirect to dashboard for "TDT4001"', () => {
    component.goToDashboard("TDT4001");
    expect(routerStub.navigate).toHaveBeenCalledWith(['dashboard/'], { queryParams: {course: "TDT4001"}});
  })

  it('search for "TDT" should set list "searchedCourses" equal to ["TDT4000","TDT4001","TDT4002"]', () => {
    component.searchForCourse("TDT");
    expect(component.searchedCourses).toEqual(["TDT4000","TDT4001","TDT4002"]);
  })

});
