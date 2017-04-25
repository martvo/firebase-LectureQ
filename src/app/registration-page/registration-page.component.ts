import { Component, OnInit } from '@angular/core';
import { AF } from "../../providers/af";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id.toString(),
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})

export class RegistrationPageComponent  {
  // variable used to show error, if any
  public error: any;

  constructor(private afService: AF, private router: Router) {}

  // registers the user as a student and logs them in
  register(event, name: string, email: string, password: string, repeatedpassword: string, isLecturer: boolean): void {
    event.preventDefault();
    if (!this.checkPassword(password, repeatedpassword)) {
      console.log("passwords must be equal!")
      return;
    }
    // waits for promise from registerUser methode
    this.afService.registerUser(email, password).then((user) => {
      // waits for promise from saveUserInfoFromForm methode
      this.afService.saveUserInfoFromForm(user.uid, name, email, isLecturer).then(() => {
        if(isLecturer){
          this.router.navigate(['lecturerDashboard']);
        }
        else{
          this.router.navigate(['studentDashboard']);
        }
      }).catch((error) => { // catches error from saveUserInfoFromForm methode
        this.error = error;
      });
    }).catch((error) => { // catches error from registerUser methode
      this.error = error;
      console.log(this.error);
    });
  }

  // checks if passwords are equal
  checkPassword(password: string, repeatedpassword: string): boolean {
    if (password != repeatedpassword)
      return false;
    else
      return true;
  }
}
