import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-edit-course-modal',
  templateUrl: './edit-course-modal.component.html',
  styleUrls: ['./edit-course-modal.component.css']
})
export class EditCourseModalComponent implements OnInit {

  // variables used for when the animation should run and for when the modal should be visible
  public visible = false;
  private visibleAnimate = false;

  // shows the modal
  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
  }

  // hides the modal
  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  constructor() { }

  ngOnInit() {
  }

}
