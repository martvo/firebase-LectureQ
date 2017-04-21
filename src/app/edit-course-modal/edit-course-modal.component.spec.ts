import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { EditCourseModalComponent } from './edit-course-modal.component';

describe('EditCourseModalComponent', () => {
  let component: EditCourseModalComponent;
  let fixture: ComponentFixture<EditCourseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCourseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('var visible should be false', () => {
    expect(component.visible).toBeFalsy();
  });

  it('var visible should be true', () => {
    component.show();
    expect(component.visible).toBeTruthy();
  });

  it('var visible should be false', fakeAsync(() => {
    component.show();
    component.hide();
    tick(350);
    expect(component.visible).toBeFalsy();
  }));

});
