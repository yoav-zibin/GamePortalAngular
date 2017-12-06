import { Injectable } from '@angular/core';

@Injectable()
export class SpecService {
  selectedSpec: any;
  selectedMatchRef: any;

  constructor() { }

  getSelectedSpec() {
    return this.selectedSpec;
  }

  getSelectedMatchRef() {
    return this.selectedMatchRef;
  }

  setSpecAndMatchRef(spec, matchRef) {
    this.selectedSpec = spec;
    this.selectedMatchRef = matchRef;
  }
}
