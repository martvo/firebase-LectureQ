import {Injectable} from "@angular/core";
import { AF } from "../providers/af";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseAuthState} from 'angularfire2';

@Injectable()
export class MockAF extends AF {
  constructor() {
    super(null);
  }

  logout(): Promise<void> {
    return new Promise<void>(null);
  }


}
