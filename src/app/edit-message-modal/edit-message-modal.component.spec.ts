import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { EditMessageModalComponent } from './edit-message-modal.component';

describe('EditMessageModalComponent', () => {
  let component: EditMessageModalComponent;
  let fixture: ComponentFixture<EditMessageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMessageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMessageModalComponent);
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
