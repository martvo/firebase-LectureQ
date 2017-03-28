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
  public hasAnswer: boolean;

  constructor(public afService: AF, private router: Router, public af: AngularFire) {
    this.messages = this.afService.messages;
    this.bubbleLog = [new Bubble(0,"Please ask me a question",true)];
    this.bubbleCount = 1;
    this.hasAnswer = false;
  }

  ngOnInit() {
    this.afService.setCourse("TDT4140");
  }

  delete(key: string) {
    this.messages.remove(key);
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
      if(result == []){
        answer = "No answer found :(";
        this.hasAnswer = false;
      }
      else{
        this.hasAnswer = true;
        answer = result[0].question.answer;
      }
      this.bubbleLog.push(new Bubble(this.bubbleCount,this.newQuestion,false));
      this.bubbleCount += 1;
      this.bubbleLog.push(new Bubble(this.bubbleCount,answer,true));
      this.bubbleCount += 1;
      this.newQuestion = "";
    }
  }

  answeredQuestion(isAnswered){
    if(isAnswered){
      this.hasAnswer = false;
    }
    else{

    }
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
    //var message = this.af.database.list('messages', {query: {orderByChild: 'key', equalsTo: key}})
    //this.messages.update(key, {likes: message.likes.push(this.afService.email)});
    var sub = this.afService.getMessages(key).subscribe(items => {
      items.forEach(item => {
        console.log(item)
        if (item.$key == "likes") {
          item.forEach(user => {
            console.log(user)
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
    //this.messages.update(key, {votes: votes + 1});
  }

  edit(key: string, edit: boolean, m: string) {
    this.editMessage = m;
    if(!edit)
      this.messages.update(key, {edit: true});
    else
      this.messages.update(key, {edit: false});
  }

  sendEdit(key: string) {
    this.messages.update(key, {message: this.editMessage, edit: false});
    this.editMessage = "";
  }

  //må fikse så at vi får en større inputfelt når vi trykker på edit
  //eller så må alt flyttes ned i send og vi sletter meldingen, men votes beholdes fortsatt
  //flytt alle funksjoner som har med firebase og gjøre over i af.ts!!!!

}
