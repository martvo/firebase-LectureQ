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
  public lecturer: any;
  public registratedUser: any;
  public questions: any;
  public af: any;
  public messages: any;

  constructor() {
    super(null);

    let af = {
      auth: Observable.from([{ auth: "qwerty"}])
    }

    this.messages = [
      {
        "TDT4001": [
          {
            key: "qwerty123",
            message: "Hei du!",
          },
          {
            key: "qwerty122",
            message: "Hvordan går det"
          }
        ],
        "TDT4002": [
          {
            key: "qwerty111",
            message: "hei"
          }
        ],
      }
    ]

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

  registerUser(email: string, password: string): Promise<any> {
    return new Promise((user) => {
      user({uid: "qwerty"});
    });
  }

  saveUserInfoFromForm(uid: string, name: string, email: string, isLecturer: boolean): Promise<any> {
    return new Promise((resolve) => {
      resolve(null);
    });
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

  removeMessage(key: string): void {
    for (let entry of this.messages) {
      if (entry == this.course) {
        for (let item of entry) {
          if (item.key = key) {
            this.messages.entry.slice(entry.indexOf(item), 1);
          }
        }
      }
    }
  }

}
