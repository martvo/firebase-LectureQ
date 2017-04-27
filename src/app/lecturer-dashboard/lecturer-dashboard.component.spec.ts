import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { EditCourseModalComponent } from '../edit-course-modal/edit-course-modal.component';
import { Router } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { LecturerDashboardComponent } from './lecturer-dashboard.component';
import { MockModal } from '../edit-course-modal/mockEdit-course-modal.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('LecturerDashboardComponent', () => {
  let component: LecturerDashboardComponent;
  let fixture: ComponentFixture<LecturerDashboardComponent>;
  let routerStub;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [
        LecturerDashboardComponent,
        EditCourseModalComponent,
      ],
      import: [
        FormsModule,
      ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
        { provide: EditCourseModalComponent, useClass: MockModal },
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

  it('course variable should be undefined', () => {
    expect(component.getCourse()).toBeUndefined();
  });

  it('should redirect to dashboard for "TDT4001"', () => {
    component.goToDashboard("TDT4001");
    expect(routerStub.navigate).toHaveBeenCalledWith(['dashboard/'], { queryParams: {course: "TDT4001"}});
  });

  it('should set course variable for use in modal to "TDT4001"', () => {
    component.show("TDT4001");
    expect(component.getCourse()).toEqual("TDT4001");
  });

  it('course variable should be equal to undefined after modal is hiden atfer beeing opened', () => {
    component.show("TMA4100");
    component.hide();
    expect(component.getCourse()).toBeNull()
  });

  it('should add a course to user courseList and to courses list, without a co lecturer',() => {
    component.addLCourse();
    expect(component.afService.user.courseList).toContain("TDT4100");
    expect(component.afService.getCourses()).toContain("TDT4100");
  });

  it('should not add a course, missing course name', () => {
    component.addLCourse();
    expect(component.afService.user.courseList).not.toContain("TDT4100");
    expect(component.afService.getCourses()).not.toContain("TDT4100");
  });

  it('should not add a course, missing course code', () => {
    component.addLCourse();
    expect(component.afService.user.courseList).not.toContain("TDT4100");
    expect(component.afService.getCourses()).not.toContain("TDT4100");
  });

  it('should add a course with a co_lecturer', () => {
    component.addLCourse();
    expect(component.afService.user.courseList).toContain("TDT4100");
    expect(component.afService.getCourses()).toContain("TDT4100");
  });

  it('should remove a course from users and course list', () => {
    component.removeLCourse("TDT4001");
    expect(component.afService.user.courseList).not.toContain("TDT4001");
    expect(component.afService.getCourses()).not.toContain("TDT4001");
  });

  it('should not remove a course from users and course list, course not existing', () => {
    component.removeLCourse("TDT4005");
    expect(component.afService.user.courseList).toEqual(["TDT4000","TDT4001","TDT4002"]);
    expect(component.afService.getCourses()).toEqual(["TDT4001","TDT4000","TDT4002","TMA4100", "TFE4101"]);
  });

  it('should add a question', () => {
    component.addQuestion();
    expect(component.afService.questions).toContain({tags: ["exam", "course"], answer: "17. of May"});
  });

  it('should not add a question, missing question', () => {
    component.addQuestion();
    expect(component.afService.questions).toEqual([]);
  });

  it('should not add a question, missing course', () => {
    component.addQuestion();
    expect(component.afService.questions).toEqual([]);
  });

  it('should not add a question, missing answer', () => {
    component.addQuestion();
    expect(component.afService.questions).toEqual([]);
  });

});
