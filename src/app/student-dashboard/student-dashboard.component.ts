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
  //public myCourses;
  public searchedCourses;

  constructor(public afService: AF, private router: Router) {
  }

  ngOnInit() {

  }

  addCourse(course: string){
    if(!(this.afService.user.courseList.includes(course))){
      this.afService.user.courseList.push(course);
      this.afService.updateCourse();
    }
  }

  removeCourse(course: string){
    var index = this.afService.user.courseList.indexOf(course);
    this.afService.user.courseList.splice(index,1);
    this.afService.updateCourse();
  }

  goToDashboard(course: string) {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard/'],{ queryParams:{ course: course }});
  }

  searchForCourse(course: string) {
    this.searchedCourses = [];
    var stringLength = course.length;
    course = course.toUpperCase();
    this.afService.courses.forEach(items => {
      for (let item of items) {
        console.log(item)
        if (course == item.$key.slice(0, stringLength)) {
          this.searchedCourses.push(item.$key);
        }
      }
    });
  }
}
