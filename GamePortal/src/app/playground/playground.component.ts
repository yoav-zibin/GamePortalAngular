import { Component, OnInit } from '@angular/core';
import {SpecService} from '../services/spec.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  constructor(private specService: SpecService) { }

  ngOnInit() {
  }

  getSpec() {
    return this.specService.getSpec();
  }

  getMatchRef() {
    return this.specService.getMatchRef();
  }
}
