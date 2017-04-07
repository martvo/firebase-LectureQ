import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';

@Component({
  selector: 'app-lecturer-dashboard',
  templateUrl: './lecturer-dashboard.component.html',
  styleUrls: ['./lecturer-dashboard.component.css']
})
export class LecturerDashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public courses: FirebaseListObservable<any>;

  constructor(public afService: AF, private router: Router) {

  }

  ngOnInit() {
  }

  addLCourse(event, courseName: string, courseCode: string, co_lecturer: string) {
    courseCode = courseCode.toUpperCase();
    if(courseName != "" && courseCode != "") {
      if (!this.afService.user.courseList.includes(courseCode)) {
        this.afService.user.courseList.push(courseCode);
        this.afService.addLCourse(this.afService.user.email, courseName, courseCode, co_lecturer);
        this.afService.updateCourse();
      }
    }
  }

  goToDashboard(course) {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard/'],{ queryParams:{ course: course }});
  }

  removeLCourse(course) {
    this.afService.removeAllMessages(course);
    this.afService.removeLCourse(course);
    console.log("course removed")
    //husk at faget må fjernes hos studentene også
  }

  //fikse slik at når man reloader siden så blir rollen i af satt til lecturer
  //hvis man er logget inn, gjør det samme med student
}
