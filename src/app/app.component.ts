import { Component } from '@angular/core';
import { AF } from "../providers/af";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id.toString(),
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // used for showing different sides of the navbar dependant on isLoggedIn
  public isLoggedIn: boolean;

  constructor(public afService: AF, private router: Router) {
    // This asynchronously checks if our user is logged in and will automatically
    // redirect them to the frontscreen page when the status changes.
    // This is just a small thing that Firebase does that makes it easy to use.
    this.afService.af.auth.subscribe(
      (auth) => {
        if(auth == null) {
          console.log("Not Logged in.");
          this.isLoggedIn = false;
          this.afService.user = null;
          this.router.navigate(['']);
        }
        else {
          console.log("Successfully Logged in.");
          if(this.afService.user == null){
            this.afService.setUserObject(auth.auth.uid);
          }
          this.isLoggedIn = true;
        }
        this.afService.hasUser.subscribe(observer=>{
          if(observer && !this.router.url.includes("/dashboard")){
            if(this.afService.user.isLecturer){
              router.navigate(['lecturerDashboard']);
            }
            else{
              router.navigate(['studentDashboard']);
            }
          }
        });
      }
    );
  }

  // Logs user out
  logout(): void {
    this.afService.logout();
  }

  // Navigates to login view
  login(): void {
    this.router.navigate(['login']);
  }

  // Navigates to register view
  register(): void {
    this.router.navigate(['register']);
  }

}
