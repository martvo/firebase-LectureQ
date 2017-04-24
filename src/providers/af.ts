import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseAuthState} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";

@Injectable()
export class AF {
  // course variable is used to identify the current course for easy access to
  // that courses questions and chat
  public course: string;
  public messages: FirebaseListObservable<any>;
  public questions: FirebaseListObservable<any>;

  // courses is used for leturers
  public courses: FirebaseListObservable<any>;

  public items;
  public user;
  public messageList;
  public hasUser: Observable<boolean>;
  private observer: Observer<boolean>;

  constructor(public af: AngularFire) {
    this.questions = this.af.database.list('questions');
    this.courses = this.af.database.list('courses');
    this.hasUser = new Observable<boolean>(observer =>{
      this.observer = observer;
      this.observer.next(false);
    });
  }

  // returns the loged in user if loged in, undefined/null if not legged in
  isLoggedIn() {
    return this.user;
  }

  // Logsout the current user
  logout(): firebase.Promise<void> {
    return this.af.auth.logout();
  }

  // Sets user object with all needed variables
  setUserObject(uid: string): void {
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
      this.observer.next(true);
    });
  }

  // updatest the list of courses in the courses list for a given user object
  updateCourse(): void {
    this.af.database.object("newUsers/" + this.user.uid + "/courses").set(this.user.courseList);
  }

  /**
   * pushes a new message to the messages array with nessasary fields
   * (FirebaseListObservable<any>)
   */
  sendMessage(text: string): void {
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

  //Removes a given messages from the database
  removeMessage(key: string): void {
    this.af.database.object("chats/" + this.course + "/" + key).remove();
  }

  /**
   * Calls the AngularFire2 service to register a new user
   * @param model
   * @returns {firebase.Promise<void>}
   */
   registerUser(email: string, password: string): firebase.Promise<FirebaseAuthState> {
     return this.af.auth.createUser({
       email: email,
       password: password
     });
   }

   // uppdates the like couter for a given messages
   upvote(key: string): void {
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
     this.af.database.object("chats/" + this.course + "/" + key).update(message);
   }

   // set the current course for easy access to propper chat and question
   setCourse(course: string): void {
     this.course = course;
     this.messages = this.af.database.list('chats/' + this.course);
     this.af.database.object('chats/' + this.course).subscribe(item => {
        this.messageList = item; // sets messages for rigth course
     });
     this.af.database.list("/questions/" + this.course).subscribe(items =>{
       this.items = items; // sets questions for rigth course
     });
   }

   // adds a question and answer to the given course
   addQuestion(course: string, question: string, answer: string): void {
     if (course != null) {
       var words = this.removeStopWords(question);
       var q = {
         tags: words,
         answer: answer
       }
       this.af.database.list("/questions/" + course).push(q);
     }
   }

   //
   askQuestion(question: string ) {
     var words = this.removeStopWords(question);
     var results = [];
     this.items.forEach(item => {
       var localValue = 0;
       item.tags.forEach(tag => {
         words.forEach(word =>{
           if(word == tag){
             localValue += 1;
           }
         });
       });
       if(localValue > 0){
         results.push({question: item, score: localValue});
       }
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
  saveUserInfoFromForm(uid: string, name: string, email: string, isLecturer: boolean): firebase.Promise<void> {
    return this.af.database.object('newUsers/' + uid).set({
      name: name,
      email: email,
      isLecturer: isLecturer,
    });
 }

 /**
 * Logs the user in using their Email/Password combo
 * @param email
 * @param password
 * @returns {firebase.Promise<FirebaseAuthState>}
 */
  loginWithEmail(email: string, password: string): firebase.Promise<FirebaseAuthState> {
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
   * @returns {firebase.Promise<void>} so that we can make the methode wait for
   * answer from the database
   */
  getCourses(): FirebaseListObservable<any> {
    return this.af.database.list('courses');
  }

  // Adds a course to the courses list in the database
  addLCourse(email: string, name: string, code: string, co_lecturer: string) {
    // Adds the course with a co_lecturer
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
    // Adds the course without a co_lecturer
    if (co_lecturer == "") {
      var course = {
        owner: email,
        courseName: name,
        timestamp: Date.now(),
      }
      this.af.database.object("courses/" + code).set(course);
    }
  }

  // Returns the courrent course
  getCurrentCourse(): string {
    return this.course;
  }

  // mothode for lecturers to remove a course
  // removes the course for all students who is attendign the course aswell
  removeLCourse(course: string): void {
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
  removeAllMessages(course: string): void {
    this.af.database.list("chats/" + course).remove();
  }

  // Removes all stopwords, and returns a array of strings
  removeStopWords(words): string[] {
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

  getMessages(key: string): FirebaseListObservable<any> {
    return this.af.database.list('chats/' + this.course + '/' + key);
  }
}
