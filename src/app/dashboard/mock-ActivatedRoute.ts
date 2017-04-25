import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {ActivatedRoute } from "@angular/router";

class MockActivatedRoute extends ActivatedRoute {
  constructor() {
      super(null, null);
      this.queryParams = Observable.of({id: "TDT4001"});
  }
}
