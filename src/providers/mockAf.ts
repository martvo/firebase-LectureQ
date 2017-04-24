import { Injectable } from "@angular/core";
import { AF } from "../providers/af";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseAuthState} from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class MockAF extends AF {

  public mockcourses: string[];
  public course: string;
  public activatedUser: any;
  public user: any;
  public registratedUser: any;

  constructor() {
    super(null);

    this.mockcourses = [
      "TDT4001",
      "TDT4000",
      "TDT4002",
      "TMA4100",
      "TFE4101",
    ];

    this.activatedUser = [
      {
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
    ];
    this.user;
  }

  public AngularFireMock = {
    auth: Observable.of({ uid: 'ABC123' })
  };

  logout(): Promise<void> {
    return new Promise<void>(null);
  }

  registerUser(email: string, password: string) {
    return this.registratedUser = {
      uid: 123214241,
      email: email,
      password: password,
    };
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

}
