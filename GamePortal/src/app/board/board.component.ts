import {Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() board: any;
  @Input() pieces: any;
  @Input() matchRef: any;
  @ViewChildren('PieceComponent') pieceComponents: QueryList<PiecesComponent>;
  constructor() { }

  ngOnInit() {
    this.setCurtState();
  }

  // TODO: make sure load from current state!
  setCurtState() {
    this.matchRef.child('pieces').once('value').then(res => {
      if (res.exists()) {
        const val = res.val();
        val.forEach((piece, index) => {
          const position = {
            x: piece.currentState.x/100*this.width,
            y: piece.currentState.x/100*this.height
          };
          const imageIndex = piece.currentState.currentImageIndex;
          this.pieceComponents[index].updatePosition();
          this.pieceComponents[index].updateIamage();
        });
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateWhenChange();
  }

  updateWhenChange() {

  }
}
