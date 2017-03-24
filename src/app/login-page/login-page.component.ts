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

  loginWithGoogle() {
    this.afService.loginWithGoogle().then((data) => {
      //send thm to the homepage if they are logged in
      //this.afService.addUserInfo();
      this.router.navigate(['dashboard']);
    })
  }

  loginWithEmail(event, email, password) {
    event.preventDefault();
    //this.afService.users.subscribe()
    this.afService.getRole(email).subscribe(items => {
      items.forEach(item => {
        if (email == item.email) {
          if (item.role == "student") {
            this.afService.loginWithEmail(email, password).then(() => {
              this.router.navigate(['studentDashboard']);
            }).catch((error: any) => {
              if (error) {
                this.error = error;
                console.log(this.error);
              }
            });

          }
          if (item.role == "lecturer") {
            this.afService.loginWithEmail(email, password).then(() => {
              this.router.navigate(['lecturerDashboard']);
            }).catch((error: any) => {
              if (error) {
                this.error = error;
                console.log(this.error);
              }
            });
          }
        }
      })
    })
  }
}
