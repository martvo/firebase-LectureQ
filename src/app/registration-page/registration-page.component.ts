import { Component, OnInit } from '@angular/core';
import {AF} from "../../providers/af";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})

export class RegistrationPageComponent  {
  public error: any;

  constructor(private afService: AF, private router: Router) {}

  //registers the user as a student and logs them in
  registerStudent(event, name, email, password, repeatedpassword) {
    event.preventDefault();
    if (!this.checkPassword(password, repeatedpassword)) {
      console.log("passwords must be equal!")
      return;
    }
    this.afService.registerUser(email, password).then((user) => {
      this.afService.saveUserInfoFromForm(user.uid, name, email).then(() => {
        this.afService.registerRole(email, "student");
        this.router.navigate(['studentDashboard']);
      }).catch((error) => {
        this.error = error;
      });
    }).catch((error) => {
      this.error = error;
      console.log(this.error);
    });
  }

  //registrates the user as a lecturer and logs them in
  registerLecturer(event, name, email, password, repeatedpassword) {
    event.preventDefault();
    if (!this.checkPassword(password, repeatedpassword)) {
      console.log("passwords must be equal!")
      return;
    }
    this.afService.registerUser(email, password).then((user) => {
      this.afService.saveUserInfoFromForm(user.uid, name, email).then(() => {
        console.log("skal vi registrere rolle?")
        this.afService.registerRole(email, "lecturer");
        this.router.navigate(['lecturerDashboard']);
      }).catch((error) => {
        this.error = error;
      });
    }).catch((error) => {
      this.error = error;
      console.log(this.error);
    });
  }

  /**
   * Checks for equal passwords
   */
  checkPassword(password, repeatedpassword) {
    if (password != repeatedpassword)
      return false;
    else
      return true;
  }
}
