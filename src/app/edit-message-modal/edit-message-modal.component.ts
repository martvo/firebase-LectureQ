import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-edit-message-modal',
  templateUrl: './edit-message-modal.component.html',
  styleUrls: ['./edit-message-modal.component.css']
})

export class EditMessageModalComponent implements OnInit {

  public visible = false;
  private visibleAnimate = false;

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  constructor() { }

  ngOnInit() {
  }

}
