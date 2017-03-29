import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public courses: FirebaseListObservable<any>;
  public myCourses;

  constructor(public afService: AF, private router: Router) {

  }

  ngOnInit() {
  }

  goToDashboard(course) {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard']);
  }

  searchForCourse(course) {
    course = course.toUpperCase();
    console.log(course)
  }

}
