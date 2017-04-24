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
  public courses: FirebaseListObservable<any>;

  // variable for all courses that match the search parameter
  public searchedCourses;

  constructor(public afService: AF, private router: Router) {
    this.afService.courses = this.afService.getCourses();
  }

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
    this.afService.user.courseList.splice(index,1);
    this.afService.updateCourse();
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
      var stringLength = course.length;
      course = course.toUpperCase();
      this.afService.courses.forEach(items => {
        for (let item of items) {
          if (course == item.$key.slice(0, stringLength)) {
            this.searchedCourses.push(item.$key);
          }
        }
      });
    }
  }
}
