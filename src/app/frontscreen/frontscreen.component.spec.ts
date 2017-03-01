import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontscreenComponent } from './frontscreen.component';

describe('FrontscreenComponent', () => {
  let component: FrontscreenComponent;
  let fixture: ComponentFixture<FrontscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
