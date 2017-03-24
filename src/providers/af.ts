import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class AF {
  public email: string;
  public displayName: string;
  public users: FirebaseListObservable<any>;
  public messages: FirebaseListObservable<any>;


  constructor(public af: AngularFire) {
    this.messages = this.af.database.list('messages');
    this.users = this.af.database.list('userRoles');
  }
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }
  /**
   * Logs out the current user
   */
  logout() {
    return this.af.auth.logout();
  }

  /**
   * Calls the AngularFire2 service to register a new user
   * @param model
   * @returns {firebase.Promise<void>}
   */

sendMessage(text) {
  var message = {
    message: text,
    timestamp: Date.now(),
    votes: 0,
    displayName: this.displayName,
    email: this.email,
    likes: [],
    edit: false
  };
  this.messages.push(message);
}

  registerUser(email, password) {
    console.log(email)
    return this.af.auth.createUser({
      email: email,
      password: password
    });
  }
  /**
   * Saves information to display to screen when user is logged in
   * @param uid
   * @param model
   * @returns {firebase.Promise<void>}
   */
  saveUserInfoFromForm(uid, name, email) {
    return this.af.database.object('registeredUsers/' + uid).set({
      name: name,
      email: email,
    });
   /**
   * Logs the user in using their Email/Password combo
   * @param email
   * @param password
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
 }

  loginWithEmail(email, password) {
    return this.af.auth.login({
        email: email,
        password: password,
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      });
  }

  registerRole(uid, email, role) {
    var userRole = {
      email: email,
      role: role,
    }
    this.users.push(userRole);
  }

  getUsers() {
    return this.af.database.list('userRoles');
  }
}
