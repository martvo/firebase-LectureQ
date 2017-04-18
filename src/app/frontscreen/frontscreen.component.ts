import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AF } from '../../providers/af';

@Component({
  selector: 'app-frontscreen',
  templateUrl: './frontscreen.component.html',
  styleUrls: ['./frontscreen.component.css']
})

export class FrontscreenComponent implements OnInit {

  constructor(public afService: AF, private router: Router) { }

  ngOnInit() {
    if (this.afService.user) {
      if (this.afService.user.isLecturer) {
        this.router.navigate(['lecturerDashboard']);
      } else {
        this.router.navigate(['studentDashboard']);
      }
    }
  }

  register() {
    this.router.navigate(['register']);
  }
}
