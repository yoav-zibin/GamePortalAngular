import { Injectable } from '@angular/core';

@Injectable()
export class SpecService {
  selectedSpec: any;
  constructor() { }

  setSelectedSpec(spec) {
    this.selectedSpec = spec;
  }

  getSelectedSpec() {
    return this.selectedSpec;
  }
}
