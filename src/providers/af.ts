import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';

@Injectable()
export class AF {
  //public email: string;
  //public displayName: string;
  // course variable is used to identify the current course for easy access to
  // that courses questions and chat
  public course: string;
  public students: FirebaseListObservable<any>;
  public lecturers: FirebaseListObservable<any>;
  public userRoles: FirebaseListObservable<any>;
  public messages: FirebaseListObservable<any>;
  public questions: FirebaseListObservable<any>;

  // courses is used for leturers
  public courses: FirebaseListObservable<any>;
  // sCourses is used for students
  public sCourses: FirebaseListObservable<any>;
  // role variable used for identifying users role
  public role: string;

  public items;
  public user;

  public testList;



  constructor(public af: AngularFire) {
    this.questions = this.af.database.list('questions');
    this.students = this.af.database.list('userRoles/students');
    this.lecturers = this.af.database.list('userRoles/lecturers');
    this.userRoles = this.af.database.list('userRoles');
    this.courses = this.af.database.list('courses');
    this.sCourses = this.af.database.list('userRoles/students');
    this.testList = [];
  }

  isLoggedIn(){
    return this.af.auth;
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

  //Logsout the current user
  logout() {
    return this.af.auth.logout();
  }

  setUserObject(uid){
    this.af.database.list('/newUsers/' + uid).subscribe(user =>{
      this.user = user;
      var courseList = [];
      if(this.user[0].length > 0){
        this.user[0].forEach(element => {
            courseList.push(element);
        });
      }
      this.user["courseList"] = courseList;
      this.user["uid"] = uid;
    });
  }

  updateStudentCourse(){
    this.af.database.object("/newUsers/" + this.user.uid+ "/courses").set(this.user.courseList);
  }


  /**
   * pushes a new message to the messages array with nessasary fields
   * (FirebaseListObservable<any>)
   */
  sendMessage(text) {
    var message = {
      message: text,
      timestamp: Date.now(),
      votes: 0,
      displayName: this.user.name,
      email: this.user.email,
      likes: [],
      edit: false
    };
    this.messages.push(message);
  }

  editMessage(key, edit, m){
    this.editMessage = m;
    if(!edit)
      this.messages.update(key, {edit: true});
    else
      this.messages.update(key, {edit: false});
  }

  sendEdit(key){

  }

  removeMessage(key){
    this.messages.remove(key);
  }

  /**
   * Calls the AngularFire2 service to register a new user
   * @param model
   * @returns {firebase.Promise<void>}
   */
   registerUser(email, password) {
     console.log(email)
     return this.af.auth.createUser({
       email: email,
       password: password
     });
   }

//set the current course for easy access to propper chat and question
setCourse(course){
  this.course = course;
  this.messages = this.af.database.list('chats/' + this.course);
  this.af.database.list("/questions/" + this.course).subscribe(items =>{
    this.items = items;
  });
}

sendQuestion(question, answer){
  var words = question.split(" ");
  var words = this.removeStopWords(words);
  var q = {
      tags: words,
      answer: answer
  }
  this.af.database.list("/questions/" + this.course).push(q);
}


askQuestion(question){
  var words = this.removeStopWords(question);
  console.log(words);
  var results = [];

  this.items.forEach(item => {
    var localValue = 0;
    item.tags.forEach(tag => {
      words.forEach(word =>{
        if(word == tag){
          localValue += 1;
        }
      });
      if(localValue > 0){
        results.push({question: item, score: localValue});
      }
    });
  });

  results.sort(function(a,b) {
      return a.score - b.score;
  });
  return results;
}

  /**
   * Saves information to display to screen when user is logged in
   * @param uid
   * @param model
   * @returns {firebase.Promise<void>}
   */
  saveUserInfoFromForm(uid, name, email,isLecturer) {
    return this.af.database.object('newUsers/' + uid).set({
      name: name,
      email: email,
      isLecturer: isLecturer,
      //courses: [] Not necesarry
    });
 }

 /**
 * Logs the user in using their Email/Password combo
 * @param email
 * @param password
 * @returns {firebase.Promise<FirebaseAuthState>}
 */
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

  /**
   * pushes a new userRole tupple to the userRoles array with nessasary fields
   * {FirebaseListObservable<any>}
   * used for differentiating lecturers from students etc.
   */
  registerRole(email, role) {
    var userRole = {
      email: email
    }
    if (role == "students") {
      this.students.push(userRole);
    }
    if (role == "lecturers") {
      this.lecturers.push(userRole);
    }
  }

  /**
   * @returns {firebase.Promise<void>}
   */
  getUsers(role) {
    return this.af.database.list('userRoles/' + role);
  }

  /**
   * @returns {firebase.Promise<void>}
   */
  getCourses() {
    return this.af.database.list('courses');
  }

  addLCourse(email, name, code, co_lecturer) {
    if (this.role == "lecturer") {
      if (co_lecturer != "") {
        this.lecturers.forEach(items => {
          items.forEach(item => {
            if (item.email == co_lecturer) {
              var course = {
                owner: email,
                courseName: name,
                courseCode: code,
                timestamp: Date.now(),
                co_lecturer: co_lecturer
              }
              this.courses.push(course);
            }
          })
        })
      }
      if (co_lecturer == "") {
        var course = {
          owner: email,
          courseName: name,
          courseCode: code,
          timestamp: Date.now(),
        }
        this.courses.push(course);
      }
    }
  }

  addSCourses(code: string) {
    if (this.role == "student") {
      var x = 0;
      var usefulKey;
      this.sCourses.forEach(items => {
        items.forEach(item => {
          if (item.courses == null && item.email == this.user.email) {
            console.log("No list with key 'courses'")
            usefulKey = item.$key;
            this.sCourses.update(usefulKey, {courses: [code]})
            x++;
          }
          if (item.courses != null && item.email == this.user.email && x < 1) {
            // inside the courses array
            usefulKey = item.$key;
            item.courses.forEach(c => {
              if (c == code) {
                console.log("Course already added")
                x++;
              }
            })
            // in the forEach item loop and if (item.course != null)
            if (x < 1) {
              console.log("Course added!")
              console.log("Liste vi ønsker å pushe til: " + item.courses)
              console.log("Ønsker å pushe: " + code)
              item.courses.push(code);
              console.log("etter å ha pushet: " + item.courses)
              this.sCourses.update(usefulKey, {courses: item.courses});
              x++;
            }
          }
        })
      })
    }
  }

// @returns this.course<string>
  getCurrentCourse() {
    return this.course;
  }

  // sets role of user
  setUserRole(role) {
    this.role = role;
  }

  // @retunrs this.role<string>
  getUserRole() {
    return this.role;
  }

  // removes a students course
  removeSCourse(code: string, email: string) {
    if (this.role == "student") {
      var usefulKey;
      var x = 0;
      this.sCourses.forEach(items => {
        items.forEach(item => {
            if (item.email == email && x < 1) {
              x++;
              item.courses.splice(item.courses.indexOf(code), 1);
              console.log(item.courses)
              this.sCourses.update(item.$key, {courses: item.courses});
            }
        });
      })
    }
  }

  // mothode for lecturers to remove a course
  // removes the course for all students who is attendign the course aswell
  removeLCourse(course, key: string) {
    if (this.role == "lecturer") {
      this.courses.remove(key);
      // removes the course from students list of courses
      this.sCourses.forEach(items => {
        items.forEach(item => {
          if (item.courses != null && (item.courses.indexOf(course.courseCode) != -1)) {
            item.courses.splice(item.courses.indexOf(course.courseCode), 1);
            console.log("her")
            this.sCourses.update(item.$key, {courses: item.courses});
          }
        })
      })
    }
  }

  // removes all messages from a given course
  removeAllMessages(course) {
    console.log(course)
    this.af.database.list("chats/" + course).remove();
  }

  removeStopWords(words){
    words = words.toLowerCase();
    words = words.replace(/[-+()!?.,'*]/g, '');
    words = words.split(" ");
    var stopWords = new Array(
        'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'i',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'like',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'point',
        'pointed',
        'pointing',
        'points',
        'possible',
        'present',
        'presented',
        'presenting',
        'presents',
        'problem',
        'problems',
        'put',
        'puts',
        'q',
        'quite',
        'r',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'small',
        'smaller',
        'smallest',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'thought',
        'thoughts',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'u',
        'under',
        'until',
        'up',
        'upon',
        'us',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'working',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'you',
        'young',
        'younger',
        'youngest',
        'your',
        'yours',
        'z'
    );
    for(var i = 0; i < stopWords.length;i++){
      for(var j = 0; j < words.length;j++){
        if(words[j] == stopWords[i]){
          words.splice(j,1);
        }
      }
    }
    return words;
  }

  getMessages(key) {
    return this.af.database.list('chats/' + this.course + '/' + key);
  }
}
