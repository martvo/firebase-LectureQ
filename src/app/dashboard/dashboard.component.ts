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

  sendMessage() {
    this.afService.sendMessage(this.newMessage);
    this.newMessage = '';
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
    /*this.afService.getMessages(key).subscribe(items => {
      items.forEach(item => {
        if (item.$key == "likes") {
          item.forEach(user => {
            if (user == this.afService.email) {
              return;
            }
          })
          this.messages.update(key, {votes: votes + 1});
          item.push(this.afService.email);
          this.messages.update(key, {likes: item})
          console.log(item)
        }
      })
    })*/
    this.messages.update(key, {votes: votes + 1});
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
