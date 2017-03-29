import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AF } from '../../providers/af';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { Bubble } from './bubble';

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public newMessage: string;
  public newQuestion: string;
  public editMessage: string;
  public messages: FirebaseListObservable<any>;
  public me: boolean;

  public bubbleLog;
  public bubbleCount;
  public previousResults;
  public hasAnswer: boolean;

  constructor(public afService: AF, private router: Router, public af: AngularFire) {
    this.messages = this.afService.messages;
    this.bubbleLog = [new Bubble(0,"Please ask me a question",true)];
    this.bubbleCount = 1;
    this.hasAnswer = false;
    this.previousResults = [];
  }

  ngOnInit() {
  }

  delete(key: string) {
    this.afService.removeMessage(key);
  }

  sendMessage() {
    this.afService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  setCourse(course){
    this.afService.setCourse(course);
  }

  askQuestion(){
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

  answeredQuestion(isAnswered){
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
        answer = "Your question does not match any existing questions";
        this.hasAnswer = false;
      }
    }
    this.bubbleLog.push(new Bubble(this.bubbleCount,answer,true));
    this.bubbleCount += 1;
  }

  isYou(email) {
    if(email == this.afService.email)
      return false;
    else
      return true;
  }
  isMe(email) {
    if(email == this.afService.email)
      return true;
    else
      return false;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
    console.log("Scroll to bottom failed!")
    }
  }

  upvote(key: string, votes: number) {
    var sub = this.afService.getMessages(key).subscribe(items => {
      items.forEach(item => {
        if (item.$key == "likes") {
          item.forEach(user => {
            if (user == this.afService.email) {
              console.log("kan ikke like to ganger!!")
              sub.unsubscribe;
            }
          })
          // in the forEach item loop and if item.$key == "likes"
          this.messages.update(key, {votes: votes + 1});
          item.push(this.afService.email);
          this.messages.update(key, {likes: item})
          console.log("Du er ikke i listen 'likes'")
          sub.unsubscribe;
        }
      })
      // in the items subscription
      this.messages.update(key, {votes: votes + 1});
      console.log("Ingen lister med nøkkel 'likes'")
      this.messages.update(key, {likes: [this.afService.email]});
      sub.unsubscribe;
    })
  }

  edit(key: string, edit: boolean, m: string) {
    this.editMessage = m;
    this.afService.editMessage(key, edit, m);
  }

  sendEdit(key: string) {
    this.messages.update(key, {message: this.editMessage, edit: false});
    this.editMessage = "";
  }

  getRole() {
    return this.afService.getUserRole();
  }

  isStudent() {
    if (this.getRole() == "student") {
      return true;
    } else
      return false;
  }

  isLecturer() {
    if (this.getRole() == "lecturer") {
      return true;
    } else
      return false;
  }

  endSession() {
    this.router.navigate(['lecturerDashboard']);
  }

  //må fikse så at vi får en større inputfelt når vi trykker på edit
  //eller så må alt flyttes ned i send og vi sletter meldingen, men votes beholdes fortsatt
  //flytt alle funksjoner som har med firebase og gjøre over i af.ts!!!!

}
