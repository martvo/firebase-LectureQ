import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public searchedCourses;  // variable for all courses that match the search parameter

  //constructor
  constructor(public afService: AF, private router: Router) {
  }

  //init function
  ngOnInit() {
  }

  // Adds a course
  addCourse(course: string): void {
    if(!(this.afService.user.courseList.includes(course))){
      this.afService.user.courseList.push(course);
      this.afService.updateCourse();
    }
  }

  // Removes a course
  removeCourse(course: string): void {
    var index = this.afService.user.courseList.indexOf(course);
    if (index != -1) {
      this.afService.user.courseList.splice(index,1);
      this.afService.updateCourse();
    }
  }

  // Navigates to correct course dashboard
  goToDashboard(course: string): void {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard/'],{ queryParams:{ course: course }});
  }

  // Search for courses matching the value of the search inputfield
  searchForCourse(course: string): void {
    if (course != "") {
      this.searchedCourses = [];
      course = course.toUpperCase();
      this.searchedCourses = this.afService.searchForCourse(course, course.length).sort();
    }
  }
}
