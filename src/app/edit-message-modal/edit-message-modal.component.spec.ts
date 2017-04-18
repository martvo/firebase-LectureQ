import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
});
