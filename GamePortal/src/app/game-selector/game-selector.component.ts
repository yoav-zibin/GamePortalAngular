import { SpecService } from '../services/spec.service';
import { GameSpec } from '../models/game-spec';
import { AngularFireDatabase } from 'angularfire2/database';
import { GroupService } from '../services/group.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-game-selector',
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.css']
})

export class GameSelectorComponent implements OnInit {
  gameSpecs: Array<GameSpec> = [];
  recentMatchSpecs: Array<GameSpec> = [];
  selectedNewGame: any;
  selectedRecentMatch: any;

  constructor(
    private af: AngularFireDatabase,
    private groupService: GroupService,
    private router: Router,
    private specService: SpecService) {
  }

  // fetching game specs from builder
  displayGameSpecs() {
    console.log('Fetching gameSpecs from builder...  ');
    // const specIdSet: Set<string> = new Set<string>();

    const path = '/gameBuilder/gameSpecs';
    const specsRef = this.af.database.ref(path);
    specsRef.on('value', function (snapshot) {
      const specs = snapshot.val();
      const specsList = [];
      for (const specKey in specs) {
        if (specKey) {
          specsList.push({
            'spec': specs[specKey],
            'gameName': specs[specKey].gameName,
            'specId': specKey,
          });
        }
      }
      this.gameSpecs = specsList;
    });
  }

  // display recent matches for specific group
  displayRecentMatchSpecs() {
    console.log('Fetching recent matches from group...  ');
    const path = '/gamePortal/groups/' + this.groupService.getGroupId + '/matches';
    const matchesRef = this.af.database.ref(path);
    matchesRef.on('value', function (snapshot) {
      const matches = snapshot.val();
      const matchesList = [];
      for (const matchKey in matches) {
        if (matchKey) {
          const specId = matches[matchKey].gameSpecId;
          const specRef = this.af.database.ref('/gameBuilder/gameSpecs/' + specId);
          specRef.once('value').then((snap) => {
            matchesList.push({
              'matchId': matchKey,
              'spec': snap.val(),
              'gameName': snap.val().gameName,
              'specId': specId,
            });
          });
        }
      }
      this.recentMatchSpecs = matchesList;
    });
  }

  startNewGame() {
    if (this.selectedNewGame) {
      // create new match from the new game
      const spec = this.selectedNewGame['spec'];
      const pieces = {};
      spec.pieces.forEach((piece, index) => {
        const res = {
          currentState: piece.initialState
        };
        pieces[index] = res;
      });
      const path = '/gamePortal/groups/' + this.groupService.getGroupId + '/matches';
      const matchesRef = this.af.database.ref(path);
      const newMatch = {
        'gameSpecId': spec.specId,
        'createdOn': firebase.database.ServerValue.TIMESTAMP,
        'lastUpdatedOn': firebase.database.ServerValue.TIMESTAMP,
        'pieces': pieces
      };
      const matchRef = matchesRef.push(newMatch);

      // set spec and match in spec service
      this.specService.setSpecAndMatchRef(spec, matchRef);
    } else {
      // TODO warn user to select a game first
    }
  }

  loadRecentMatch() {
    if (this.selectedRecentMatch) {
      const path = '/gamePortal/groups/' + this.groupService.getGroupId + '/matches/' + this.selectedRecentMatch.matchId;
      const matchRef = this.af.database.ref(path);
      const spec = this.selectedRecentMatch.spec;
      this.specService.setSpecAndMatchRef(spec, matchRef);
    } else {
      // TODO warn user to select a match first
    }
  }

  ngOnInit() {
    this.displayGameSpecs();
    this.displayRecentMatchSpecs();
  }

}
