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
      this.afService.updateStudentCourse();
    }
  }

  removeCourse(course: string){
    this.afService.user.courseList.remove(course);
    this.afService.updateStudentCourse();
  }

  /*
  updateMyCourses2() {
    this.myCourses = [];
    this.courses.subscribe(items => {
      items.forEach(item => {
        if (item.email == this.afService.user.email) {
          if (item.courses != null) {
            for (let entry of item.courses) {
              this.myCourses.push(entry);
            }
          }
        }
      })
    })
  }

  removeSCourse(code: string) {
    console.log("removing course")
    this.afService.removeSCourse(code, this.afService.user.email);
    this.updateMyCourses();
  }
  */

  goToDashboard(course: string) {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard/'],{ queryParams:{ course: course }});
  }

  searchForCourse(course: string) {
    this.searchedCourses = [];
    var stringLength = course.length;
    course = course.toUpperCase();
    var allCourses = this.afService.getCourses().subscribe(items => {
      items.forEach(item => {
        if (course == item.courseCode.slice(0, stringLength)) {
          this.searchedCourses.push(item.courseCode);
        }
      })
    });
  }
  /*
  addSCourse(course: string) {
    this.afService.addSCourses(course);
    this.updateMyCourses();
    // LA STÅ, BESTE Å GJØRE I AF ELLER HÆR????
    /**var usefulKey;
    var sub = this.afService.getUsers("students").subscribe(items => {
      items.forEach(item => {
        if (item.courses == null && item.email == this.afService.user.email) {
          console.log("No list with key 'courses'")
          usefulKey = item.$key;
          this.courses.update(usefulKey, {courses: [course]})
          sub.unsubscribe;
        }
        if (item.courses != null && item.email == this.afService.user.email) {
          // inside the courses array
          usefulKey = item.$key;
          item.courses.forEach(c => {
            if (c == course) {
              console.log("Course already added")
              sub.unsubscribe;
            }
          })
          // in the forEach item loop and if (item.course != null)
          console.log("Course added!")
          console.log("Liste vi ønsker å pushe til: " + item.courses)
          console.log("Ønsker å pushe: " + course)
          item.courses.push(course);
          console.log("etter å ha pushet: " + item.courses)
          this.courses.update(usefulKey, {courses: item.courses})
          sub.unsubscribe;
        }
      })
    })

  }
  */
}
