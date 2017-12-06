import { Injectable } from '@angular/core';

@Injectable()
export class SpecService {
  selectedSpecId: string;
  matchId: string;
  constructor() { }

  setSelectedSpec(specId) {
    this.selectedSpecId = specId;
  }

  getSelectedSpecId() {
    return this.selectedSpecId;
  }

  setMatchId(matchId) {
    this.matchId = matchId;
  }

  getMatchId() {
    return this.matchId;
  }
}
