import { Component, OnInit } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public error: any; // variable used to show error, if any

  //constructor
  constructor(public afService: AF, private router: Router) {}

  // Redirects user after loged in
  redirectAfterLogin(): void{
    if(this.afService.user.isLecturer){
      this.router.navigate(['lecturerDashboard']);
    }
    else{
      this.router.navigate(['studenDashboard']);
    }
  }

  // logs the user inn with email and password
  loginWithEmail(event, email: string, password: string): void {
    event.preventDefault();
    /**
     * waits for answer from the database before
     * continuing with the login process, which happens from the app.component.ts
     */
     this.afService.loginWithEmail(email,password).then(() => {
     });
  }
}
