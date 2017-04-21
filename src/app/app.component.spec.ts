import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from "@angular/router/testing";
import { AF } from "../providers/af";
import { AngularFire, FirebaseUrl, AngularFireAuth } from 'angularfire2';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  class AngularFireAuthMock extends AngularFireAuth {

  }

  class AngularFireMock extends AngularFire {

  }

  class AFMock extends AF {

  }

  class FirebaseUrlMock {

  }

  beforeEach(() => {
    const firebaseConfig = {
      apiKey: 'xxx',
      authDomain: 'xxx',
      databaseURL: 'xxx',
      storageBucket: 'xxx',
      messagingSenderId: 'xxx',
    };

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: AF, useClass: AFMock },
        { provide: AngularFire, useClass: AngularFireMock },
        { provide: FirebaseUrl, useClass: FirebaseUrlMock },
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
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
