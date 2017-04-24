import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  moduleId: module.id.toString(),
  selector: 'app-frontscreen',
  templateUrl: './frontscreen.component.html',
  styleUrls: ['./frontscreen.component.css']
})

export class FrontscreenComponent implements OnInit {

  constructor(private router: Router) { }

  // TODO: fikse slik at hvis man er logget inn og søker opp hovedsiden så blir man sendt til rett dashboard!!!
  ngOnInit() {}

  // Navigates to register view
  register(): void {
    this.router.navigate(['register']);
  }
}
