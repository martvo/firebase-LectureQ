import { Component, OnInit } from '@angular/core';
import { Injectable } from "@angular/core";

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
