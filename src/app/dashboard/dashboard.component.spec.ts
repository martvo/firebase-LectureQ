import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { MockAF } from "../../providers/mockAf";
import { AF } from "../../providers/af";
import { DashboardComponent } from './dashboard.component';
import { SortOnLikePipe } from '../sort-on-like.pipe'
import { EditMessageModalComponent } from '../edit-message-modal/edit-message-modal.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MockActivatedRoute } from './mock-ActivatedRoute';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routerStub;

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
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
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
