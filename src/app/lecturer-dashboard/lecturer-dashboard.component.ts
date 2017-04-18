import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { EditCourseModalComponent } from '../edit-course-modal/edit-course-modal.component';

@Component({
  moduleId: module.id,
  selector: 'app-lecturer-dashboard',
  templateUrl: './lecturer-dashboard.component.html',
  styleUrls: ['./lecturer-dashboard.component.css']
})
export class LecturerDashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild(EditCourseModalComponent)
  public readonly modal: EditCourseModalComponent;
  public courses: FirebaseListObservable<any>;

  // used for modal
  private course: string;

  constructor(public afService: AF, private router: Router) {

  }

  ngOnInit() {
  }

  show(course: string) {
    console.log(course)
    this.course = course;
    this.modal.show();
  }

  hide() {
    this.course = null;
    this.modal.hide();
  }

  getCourse() {
    return this.course;
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

  addQuestion(question: string, answer: string, course: string) {
    if (question != "" && answer != "" && course != null) {
      this.afService.addQuestion(course, question, answer);
    }
  }

  addLecturer(lecturer: string) {
    if (lecturer != null) {
      console.log(lecturer)
    }
  }

  //fikse slik at når man reloader siden så blir rollen i af satt til lecturer
  //hvis man er logget inn, gjør det samme med student
}
