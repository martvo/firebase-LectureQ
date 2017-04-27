import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { DashboardComponent } from './dashboard.component';
import { SortOnLikePipe } from '../sort-on-like.pipe'
import { EditMessageModalComponent } from '../edit-message-modal/edit-message-modal.component';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';
import { MockModal } from '../edit-course-modal/mockEdit-course-modal.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routerStub;

  class MockActivatedRoute extends ActivatedRoute {
    constructor() {
        super();
        this.queryParams = Observable.of({ 'course': "TDT4001" });
    }
  }

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        SortOnLikePipe,
        EditMessageModalComponent,
       ],
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: AF, useClass: MockAF },
        { provide: Router, useValue: routerStub },
        { provide: EditMessageModalComponent, useClass: MockModal },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        /**{
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({ course: "TDT4001" })
          }
        },**/
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

  it('should go back to studentDashboard, user in mockAf is a student', () => {
    component.goBack();
    expect(routerStub.navigate).toHaveBeenCalledWith(['studentDashboard']);
  })

  it('should go back to lecturerDashboard, user in mockAf is changed to a lecturer', () => {
    component.afService.user.isLecturer = true;
    component.goBack();
    expect(routerStub.navigate).toHaveBeenCalledWith(['lecturerDashboard']);
  })

  it('newMessage, newUsers, modalMessage, modalMessageKey should all be undefined at start', () => {
    expect(component.newMessage).toBeUndefined();
    expect(component.newQuestion).toBeUndefined();
    expect(component.getModalMessage()).toBeUndefined();
    expect(component.getModalMessageKey()).toBeUndefined();
  })


  it('should set modalMessage and modalMessageKey to "heihei" and "fjei3813fhuw" when editing a message', () => {
    component.show("heihei", "fjei3813fhuw");
    expect(component.getModalMessage()).toEqual("heihei");
    expect(component.getModalMessageKey()).toEqual("fjei3813fhuw");
  })

  it('should set modalMessage and modalMessageKey to null when modal is hidden', () => {
    component.show("heihei", "fjei3813fhuw");
    component.hide();
    expect(component.getModalMessage()).toBeNull();
    expect(component.getModalMessageKey()).toBeNull();
  })

});
