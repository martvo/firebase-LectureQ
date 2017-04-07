import { Component, OnInit } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public error: any;

  constructor(public afService: AF, private router: Router) {}

  redirectAfterLogin(){
    if(this.afService.user.isLecturer){
      this.router.navigate(['lecturerDashboard']);
    }
    else{
      this.router.navigate(['studenDashboard']);
    }
  }

  // logs the user inn with email and password
  loginWithEmail(event, email, password) {
    event.preventDefault();
    /**
     * waits for answer from the database before
     * continuing with the login process
     */
     this.afService.loginWithEmail(email,password).then(() => {
     });
  }
}
