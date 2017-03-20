import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AF } from '../../providers/af';
import { FirebaseListObservable, AngularFire } from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public newMessage: string;
  public editMessage: string;
  public messages: FirebaseListObservable<any>;
  public me: boolean;

  constructor(public afService: AF, private router: Router, public af: AngularFire) {
    this.messages = this.afService.messages;
  }

  ngOnInit() {

  }

  delete(key: string) {
    this.messages.remove(key);
  }

  sendMessage(){
    this.afService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  isYou(email) {
    if(email == this.afService.email)
      return true;
    else
      return false;
  }
  isMe(email) {
    if(email == this.afService.email)
      return false;
    else
      return true;
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
    this.messages.update(key, {votes: votes + 1});
  }

  edit(key: string, edit: boolean, m: string) {
    this.editMessage = m;
    if(!edit)
      this.messages.update(key, {edit: true});
    else
      this.messages.update(key, {edit: false});
  }

  sendEdit(key: string){
    this.messages.update(key, {message: this.editMessage, edit: false});
    this.editMessage = "";
  }

}
