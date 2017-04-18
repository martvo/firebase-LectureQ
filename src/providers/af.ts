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
  public messageList;

  constructor(public af: AngularFire) {
    this.questions = this.af.database.list('questions');
    this.students = this.af.database.list('userRoles/students');
    this.lecturers = this.af.database.list('userRoles/lecturers');
    this.userRoles = this.af.database.list('userRoles');
    this.courses = this.af.database.list('courses');
    this.sCourses = this.af.database.list('userRoles/students');
  }

  isLoggedIn(){
    return this.user;
  }

  //Logsout the current user
  logout() {
    this.user;
    return this.af.auth.logout();
  }

  setUserObject(uid){
    this.af.database.object('/newUsers/' + uid).subscribe(user => {
      this.user = user;
      var courseList = [];
      if(this.user.courses){
        this.user.courses.forEach(element => {
            courseList.push(element);
        });
      }
      this.user["courseList"] = courseList;
      this.user["uid"] = uid;
    });
  }

  updateCourse(){
    this.af.database.object("newUsers/" + this.user.uid + "/courses").set(this.user.courseList);
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
      likes: []
    };
    this.messages.push(message);
  }

  removeMessage(key){
    this.af.database.object("chats/" + this.course + "/" + key).remove();
    //this.messages.remove(key);
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

   upvote(key){
     var message = this.messageList[key];
     if(message.likes != undefined){
       if(!message.likes.includes(this.user.email)){
         message.votes = message.votes + 1;
         message.likes.push(this.user.email);
       }
     }
     else{
       message.likes = [this.user.email];
       message.votes = message.votes +1;
     }
     //this.messageList[key] = message; //Maybe useless
     this.af.database.object("chats/" + this.course + "/" + key).update(message);
   }

   //set the current course for easy access to propper chat and question
   setCourse(course){
     this.course = course;
     this.messages = this.af.database.list('chats/' + this.course);

    this.af.database.object('chats/' + this.course).subscribe(item => {
        this.messageList = item;
     });
     this.af.database.list("/questions/" + this.course).subscribe(items =>{
       this.items = items;
     });
   }

   // adds a question to the given course
   addQuestion(course: string, question: string, answer: string){
     if (course != null) {
       var words = this.removeStopWords(question);
       var q = {
         tags: words,
         answer: answer
       }
       this.af.database.list("/questions/" + course).push(q);
     }
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
    if (co_lecturer != "") {
      this.af.database.list("newUsers").subscribe(items => {
        items.forEach(item => {
          if (item.isLecturer && item.email == co_lecturer && co_lecturer != this.user.email) {
            var course = {
              owner: email,
              courseName: name,
              timestamp: Date.now(),
              co_lecturer: [co_lecturer]
            }
            this.af.database.object("courses/" + code).set(course);
          }
        })
      })
    }
    if (co_lecturer == "") {
      var course = {
        owner: email,
        courseName: name,
        timestamp: Date.now(),
      }
      this.af.database.object("courses/" + code).set(course);
    }
  }

  // @returns this.course<string>
  getCurrentCourse() {
    return this.course;
  }

  // mothode for lecturers to remove a course
  // removes the course for all students who is attendign the course aswell
  removeLCourse(course) {
    this.courses.remove(course);
    // removing the course from every student
    this.af.database.list("newUsers").subscribe(items => {
      items.forEach(item => {
        if (item.courses) {
          if (item.courses.includes(course)) {
            item.courses.splice(item.courses.indexOf(course), 1);
            this.af.database.list("newUsers").update(item.$key, {courses: item.courses});
          }
        }
      })
    })
    // removing all the questions for the given course
    this.questions.remove(course);
  }

  // removes all messages from a given course
  removeAllMessages(course) {
    console.log(course)
    this.af.database.list("chats/" + course).remove();
  }

  // uppdates the like couter for a given messages
  likeMessage(key: string, votes: number): void {
    const sub = this.af.database.object("chats/" + this.course + "/" + key);
    sub.subscribe(item => {
      if (item.likes) {
        if (item.likes.includes(this.user.email)) {
          console.log("kan ikke like to ganger!!")
        } else {
          this.messages.update(key, {votes: votes + 1});
          item.likes.push(this.user.email)
          console.log(item.likes)
          this.messages.update(key, {likes: item.likes})
        }
      } else {
        this.messages.update(key, {votes: votes + 1});
        this.messages.update(key, {likes: [this.user.email]});
        console.log("Ingen lister med nøkkel 'likes'")
      }
    })
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
