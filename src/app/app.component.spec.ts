import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from "@angular/router/testing";
import { MockAF } from "../providers/mockAf";
import { AF } from "../providers/af";
import { AngularFire, FirebaseUrl, AngularFireAuth, AngularFireModule } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { environment } from '../environments/environment';


let AngularFireMock = {
  auth: Observable.of({ uid: 'ABC123' })
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: AngularFire, useClass: AngularFireMock },
        { provide: AF, useClass: MockAF },
      ],
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
    })
  );

  /**
  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
  */
});
