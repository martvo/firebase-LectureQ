import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { EditCourseModalComponent } from '../edit-course-modal/edit-course-modal.component';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-lecturer-dashboard',
  templateUrl: './lecturer-dashboard.component.html',
  styleUrls: ['./lecturer-dashboard.component.css']
})
export class LecturerDashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  // Lets us access the metodes from the edit-course-modal component, the metodes from <app-edit-course-modal>
  @ViewChild(EditCourseModalComponent)

  // Variable for edit course modal
  public readonly modal: EditCourseModalComponent;

  // used for modal to show which course is beeing edited
  private course: string;

  private newQuestion: string;
  private newAnswer: string;
  private newLecturer: string;

  private newCourseName: string;
  private newCourseCode: string;
  private newCoLecturer: string;

  //Constructor
  constructor(public afService: AF, private router: Router) {
  }

  //init function
  ngOnInit() {
  }

  // sets variable and shows modal
  show(course: string): void {
    this.course = course;
    this.modal.show();
  }

  // sets variable to null and hides modal
  hide(): void {
    this.course = null;
    this.modal.hide();
  }

  // @returns string
  getCourse(): string {
    return this.course;
  }

  // adds a new course for the lecturer
  addLCourse(): void {
    this.newCourseCode = this.newCourseCode.toUpperCase();
    if(this.newCourseName != "" && this.newCourseCode != "") {
      if (!this.afService.user.courseList.includes(this.newCourseCode)) {
        this.afService.user.courseList.push(this.newCourseCode);
        this.afService.addLCourse(this.afService.user.email, this.newCourseName, this.newCourseCode, this.newCoLecturer);
        this.afService.updateCourse();

        this.newCourseName = "";
        this.newCourseCode = "";
        this.newCoLecturer = "";
      }
    }
  }

  // navigates to given dashboard
  goToDashboard(course: string): void {
    this.afService.setCourse(course);
    this.router.navigate(['dashboard/'],{ queryParams:{ course: course }});
  }

  // removes a course, both from student and lecturer. Removes all messages for the course too
  removeLCourse(course: string): void {
    this.afService.removeAllMessages(course);
    this.afService.removeLCourse(course);
  }

  //Add new question to database
  addQuestion(){
    if (this.newQuestion != "" && this.newAnswer != "" && this.course  != null) {
      this.afService.addQuestion(this.course, this.newQuestion, this.newAnswer);
      this.newQuestion = "";
      this.newAnswer = "";
    }
  }

  // adds a co_lecturer, not in use yet
  addLecturer(): void {
    if (this.newLecturer != "") {
      this.newLecturer = "";
    }
  }

}
