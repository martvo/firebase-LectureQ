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

export const firebaseConfig = {
  apiKey: "AIzaSyDWUtLOkA-E2uKUIjzjL_Rxlxt4uMcSwNM",
  authDomain: "fir-lectureq.firebaseapp.com",
  databaseURL: "https://fir-lectureq.firebaseio.com",
  storageBucket: "fir-lectureq.appspot.com",
  messagingSenderId: "937804058730"
};

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationPageComponent },
  { path: '', component: FrontscreenComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RegistrationPageComponent,
    LoginPageComponent,
    DashboardComponent,
    FrontscreenComponent
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
