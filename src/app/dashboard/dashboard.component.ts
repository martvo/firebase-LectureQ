import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AF } from '../../providers/af';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { Bubble } from './bubble';
import { EditMessageModalComponent } from '../edit-message-modal/edit-message-modal.component';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  // Lets us access the metodes from the edit-message-modal component, the metodes from <app-edit-message-modal>
  @ViewChild(EditMessageModalComponent)

  // Variable for edit message modal
  public readonly modal: EditMessageModalComponent;

  // Variables used for both inputfields
  public newMessage: string;
  public newQuestion: string;

  // variables used by the ChatBot
  public bubbleLog;
  public bubbleCount;
  public previousResults;
  public hasAnswer: boolean;

  // used for modal
  private modalMessage: string;
  private modalMessageKey: string;

  constructor(public afService: AF, private router: Router, private route: ActivatedRoute) {
    // Initiates the first chatbot bubble
    this.bubbleLog = [new Bubble(0,"Please ask me a question",true)];
    this.bubbleCount = 1;
    this.hasAnswer = false;
    this.previousResults = [];
  }

  ngOnInit(): void {
    var sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to error if no query param provided.
        this.afService.setCourse(params['course'] || "error");
      });
  }

  // redirects to proper dashboard based on the isLecturer variable
  goBack(): void {
    if (this.afService.user) {
      if (this.afService.user.isLecturer) {
        this.router.navigate(['lecturerDashboard']);
      } else {
        this.router.navigate(['studentDashboard']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

  // sets variables and shows modal
  show(key: string, message: string): void {
    this.modalMessage = message;
    this.modalMessageKey = key;
    this.modal.show();
  }

  // sets variables to null and hides modal
  hide(): void {
    this.modalMessage = null;
    this.modalMessageKey = null;
    this.modal.hide();
  }

  // @returns string
  getModalMessageKey(): string {
    return this.modalMessageKey;
  }

  // @returns string
  getModalMessage(): string {
    return this.modalMessage;
  }

  // removes message with givn key
  delete(key: string): void {
    this.afService.removeMessage(key);
  }

  // send message
  sendMessage(): void {
    this.afService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  // sets course
  setCourse(course: string): void {
    this.afService.setCourse(course);
  }

  // Asks question to chatbot
  askQuestion(): void {
    if(this.newQuestion != ""){
      var result = this.afService.askQuestion(this.newQuestion);
      var answer = "";
      if(result.length == 0){
        answer = "No answer found :(";
        this.hasAnswer = false;
      }
      else{
        var firstAnswer = result.pop();
        this.hasAnswer = true;
        answer = firstAnswer.question.answer;
        this.previousResults = result;
      }
      this.bubbleLog.push(new Bubble(this.bubbleCount,this.newQuestion,false));
      this.bubbleCount += 1;
      this.bubbleLog.push(new Bubble(this.bubbleCount,answer,true));
      this.bubbleCount += 1;
      this.newQuestion = "";
    }
  }

  // Answers question
  answeredQuestion(isAnswered: boolean): void {
    console.log(this.previousResults);
    var answer = ""
    if(isAnswered){
      this.bubbleLog.push(new Bubble(this.bubbleCount,"Thats the perfect answer!",false));
      this.bubbleCount += 1;

      this.hasAnswer = false;
      answer = "That's nice :)"
      this.previousResults = [];
    }
    else{

      this.bubbleLog.push(new Bubble(this.bubbleCount,"Not the answer i was looking for",false));
      this.bubbleCount += 1;

      if(this.previousResults.length > 0){
        var result = this.previousResults.pop();
        answer = result.question.answer;

        this.bubbleLog.push(new Bubble(this.bubbleCount, "How about:",true));
        this.bubbleCount += 1;
      }
      else{
        answer = "I don't know that answer.. Try asking the lecturer!";
        this.hasAnswer = false;
      }
    }
    this.bubbleLog.push(new Bubble(this.bubbleCount,answer,true));
    this.bubbleCount += 1;
  }

  // @returns false if email is belonging to user
  isYou(email: string): boolean {
    if(email == this.afService.user.email)
      return false;
    else
      return true;
  }

  // @returns true if email is belonging to user
  isMe(email: string): boolean {
    if(email == this.afService.user.email)
      return true;
    else
      return false;
  }

  // Lifecycle hook that is called after every check of a component's view
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // Scrolls component to bottom
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
    console.log("Scroll to bottom failed!")
    }
  }

  // Adds 1 to a given message vote variabel, if user hasen't voted before
  upvote(key: string, votes: number): void {
    this.afService.upvote(key);
  }

  // Update a given messages based on the value from edit-message-modal
  sendEdit(key: string, message: string): void {
    this.afService.messages.update(key, {message: message});
    this.modal.hide();
  }

  // @returns true if user is student
  isStudent(): boolean {
    if (!this.afService.user.isLecturer) {
      return true;
    } else
      return false;
  }

  // @returns true if user is lecturer
  isLecturer(): boolean {
    if (this.afService.user.isLecturer) {
      return true;
    } else
      return false;
  }

  // Methode only availible for lecturer, deletes all messages from chat view and navigates to lecturer dashboard
  endSession(): void {
    this.router.navigate(['lecturerDashboard']);
    this.afService.removeAllMessages(this.afService.course);
  }

}
