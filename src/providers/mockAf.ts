import { Injectable } from "@angular/core";
import { AF } from "../providers/af";
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class MockAF extends AF {

  public mockcourses: string[];
  public course: string;
  public user: any;
  public registratedUser: any;
  public questions: any;
  public af: any;

  constructor() {
    super(null);

    this.mockcourses = [
      "TDT4001",
      "TDT4000",
      "TDT4002",
      "TMA4100",
      "TFE4101",
    ];

    this.user = {
      uid: "d9XXZSXZWqd0EdnAmvnPDh8larB2",
      name: "martin",
      isLecturer: false,
      email: "martin1@martin.com",
      courseList: [
        "TDT4000",
        "TDT4001",
        "TDT4002",
      ]
    }

    this.questions = [];
    this.af = {
      auth: new Promise<any>(null),
    }
  }

  logout(): Promise<void> {
    return new Promise<void>(null);
  }

  registerUser(email: string, password: string): Promise<FirebaseAuthState> {
    return new Promise<FirebaseAuthState>(null);
  }

  saveUserInfoFromForm(uid: string, name: string, email: string, isLecturer: boolean): Promise<void> {
    return new Promise<void>(null);
  }

  searchForCourse(course: string, stringLenght: number): string[] {
    var outList = [];
    for (let entry of this.mockcourses) {
      if (course == entry.slice(0, stringLenght)) {
        outList.push(entry);
      }
    }
    return outList;
  }

  setCourse(course: string): void {
    this.course = course;
  }

  addLCourse(emial: string, courseName: string, courseCode: string, co_lecturer: string): void {
    if (co_lecturer != "") {
      this.mockcourses.push(courseCode);
    }
    if (co_lecturer == "") {
      this.mockcourses.push(courseCode);
    }
  }

  updateCourse(): void {
    console.log("Here would the database have been updated")
  }

  getCourses(): string[] {
    return this.mockcourses;
  }

  removeAllMessages(): void {

  }

  removeLCourse(course: string): void {
    if (this.mockcourses.indexOf(course) != -1) {
      this.mockcourses.splice(this.mockcourses.indexOf(course), 1);
    }
    if (this.user.courseList.indexOf(course) != -1) {
      this.user.courseList.splice(this.user.courseList.indexOf(course), 1);
    }
  }

  addQuestion(course: string, question: string, answer: string): void {
    if (course != null) {
      var words = this.removeStopWords(question);
      var q = {
        tags: words,
        answer: answer,
      }
      this.questions.push(q);
    }
  }



}
