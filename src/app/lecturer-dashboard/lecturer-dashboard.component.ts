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
    this.courses = this.afService.getCourses();
    this.courses.subscribe(courses => {
      courses.forEach(course => { // each course object
        if (course.owner == this.afService.email) {
          this.myCourses.push(course);
        }
      })
    });
  }

  ngOnInit() {
  }

  addCourse(event, courseName, courseCode, co_lecturer) {
    this.afService.addCourse(this.afService.email, courseName, courseCode, co_lecturer);
  }



}
