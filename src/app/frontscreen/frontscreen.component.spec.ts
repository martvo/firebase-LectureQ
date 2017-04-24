import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { FrontscreenComponent } from './frontscreen.component';

describe('FrontscreenComponent', () => {
  let component: FrontscreenComponent;
  let fixture: ComponentFixture<FrontscreenComponent>;
  let routerStub;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [ FrontscreenComponent ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
      ],
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

  it('should navigate to "register" page', () => {
    component.register();
    expect(routerStub.navigate).toHaveBeenCalledWith(['register']);
  })

});
