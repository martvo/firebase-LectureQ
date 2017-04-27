import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";
import { FormsModule } from '@angular/forms';

@Injectable()
export class MockModal implements OnInit {

  public show(): void {
    return;
  }

  public hide(): void {
    return;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
