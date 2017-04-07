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
  public myCourses;

  constructor(public afService: AF, private router: Router) {
    this.myCourses = [];
    this.updateMyCourses();
  }

  ngOnInit() {
  }

  updateMyCourses() {
    this.myCourses = [];
    this.courses = this.afService.getCourses();
    this.courses.subscribe(courses => {
      courses.forEach(course => { // each course object
        if (course.owner == this.afService.user.email || course.co_lecturer == this.afService.user.email) {
          this.myCourses.push(course);
        }
      })
    });
  }

  addLCourse(event, courseName: string, courseCode: string, co_lecturer: string) {
    courseCode = courseCode.toUpperCase();
    if(courseName != "" && courseCode != "") {
      if (this.afService.user.courseList == null) {
        this.afService.user.courseList.push(courseCode);
        this.afService.updateCourse();
        this.afService.addLCourse(this.afService.user.email, courseName, courseCode, co_lecturer);
      } else {
        if (!this.afService.user.courseList.includes(courseCode)) {
          this.afService.user.courseList.push(courseCode);
          this.afService.addLCourse(this.afService.user.email, courseName, courseCode, co_lecturer);
          this.afService.updateCourse();
        }
      }
    }
  }

  goToDashboard(course) {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard']);
  }

  removeLCourse(course, key: string) {
    this.afService.removeAllMessages(course.courseCode);
    this.afService.removeLCourse(course, key);
    console.log("course removed")
    this.updateMyCourses();
    //husk at faget må fjernes hos studentene også
  }

  //fikse slik at når man reloader siden så blir rollen i af satt til lecturer
  //hvis man er logget inn, gjør det samme med student
}
