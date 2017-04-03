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
      //send them to the homepage if they are logged in
      //this.afService.addUserInfo();
      this.router.navigate(['dashboard']);
    })
  }

  // logs the user inn with email and password
  loginWithEmail(event, email, password) {
    event.preventDefault();
    /**
     * waits for answer from the database before
     * continuing with the login process
     */
     var login = this.afService.loginWithEmail(email,password);
     console.log(login);

     var sub1 = this.afService.getUsers("students").subscribe(items => {
       items.forEach(item => {
         if (item.email == email) {
           this.afService.loginWithEmail(email, password).then(() => {
             this.afService.setUserRole("student");
             this.router.navigate(['studentDashboard']);
             sub2.unsubscribe;
             return;
           })
         }
       })
     })

     var sub2 = this.afService.getUsers("lecturers").subscribe(items => {
       items.forEach(item => {
         if (item.email == email) {
           this.afService.loginWithEmail(email, password).then(() => {
             this.afService.setUserRole("lecturer");
             this.router.navigate(['lecturerDashboard']);
             sub2.unsubscribe;
             return;
           })
         }
       })
     })
     /**
    var sub = this.afService.getUsers("students").subscribe(items => {
      items.forEach(item => {
        console.log(item)
        if (item.$key == "students") {
          item.forEach(user => {        // logs user in as a student
            if (user == email) {
              this.afService.loginWithEmail(email, password).then(() => {
                this.router.navigate(['studentDashboard']);
                sub.unsubscribe;
              }).catch((error: any) => {
                if (error) {
                  this.error = error;
                  console.log(this.error);
              }
            });
            }
          })
          if (item.$key == "lecturers") {      // losg user in as a lecturer
            item.forEach(user => {
              if (user == email) {
                this.afService.loginWithEmail(email, password).then(() => {
                  this.router.navigate(['lecturerDashboard']);
                  sub.unsubscribe;
                }).catch((error: any) => {
                  if (error) {
                    this.error = error;
                    console.log(this.error);
                  }
                });
              }
            })
          }
        }
      })
    })
    */
  }
}
