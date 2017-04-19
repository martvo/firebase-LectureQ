import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes }   from '@angular/router';

import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AF } from '../providers/af';
import { FrontscreenComponent } from './frontscreen/frontscreen.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { LecturerDashboardComponent } from './lecturer-dashboard/lecturer-dashboard.component';
import { firebaseConfig } from './config';
import { EditCourseModalComponent } from './edit-course-modal/edit-course-modal.component';
import { EditMessageModalComponent } from './edit-message-modal/edit-message-modal.component';
import { SortOnLikePipe } from './sort-on-like.pipe';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard:course', component: DashboardComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationPageComponent },
  { path: '', component: FrontscreenComponent },
  { path: 'studentDashboard', component: StudentDashboardComponent },
  { path: 'lecturerDashboard', component: LecturerDashboardComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RegistrationPageComponent,
    LoginPageComponent,
    DashboardComponent,
    FrontscreenComponent,
    StudentDashboardComponent,
    LecturerDashboardComponent,
    EditCourseModalComponent,
    EditMessageModalComponent,
    SortOnLikePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes)
  ],
  providers: [AF],
  bootstrap: [AppComponent],

})
export class AppModule { }
