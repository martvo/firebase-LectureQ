import { Component, OnInit } from '@angular/core';
import { AF } from '../../providers/af';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lecturer-dashboard',
  templateUrl: './lecturer-dashboard.component.html',
  styleUrls: ['./lecturer-dashboard.component.css']
})
export class LecturerDashboardComponent implements OnInit {

  constructor(public afService: AF, private router: Router) {}

  ngOnInit() {
  }



}
