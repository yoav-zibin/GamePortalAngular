///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {PieceComponent} from '../piece/piece.component';
import { KonvaModule } from 'ng2-konva';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnChanges {
  @Input() board: any;
  @Input() pieces: any;
  @Input() matchRef: any;
  @ViewChild(Layer) pieceCanvas: Layer;
  @ViewChildren(PieceComponent) pieceComponents: QueryList<PieceComponent>;
  //
  pieceImageIndices: Array<any>;
  width: number;
  height: number;
  constructor() {
    this.width = 600;
    this.height = 600;
  }

  ngOnInit() {
    this.pieceImageIndices = new Array(this.pieces.length).fill(0);
    this.setCurtState(this.matchRef);
    this.startPieceListener(this.matchRef);
  }

  // TODO: make sure load from current state!
  setCurtState(matchRef) {
    matchRef.child('pieces').once('value').then(snap => {
      if (snap.exists()) {
        const pieces = snap.val();
        pieces.forEach((piece, index) => {
          const position = {
            // piece.currentState stores the percentage
            x: piece.currentState.x / 100 * this.width,
            y: piece.currentState.x / 100 * this.height
          };
          const zDepth = piece.currentState.zDepth;
          const imageIndex = piece.currentState.currentImageIndex;
          if (index < this.pieceComponents.length) {
            const curtPiece = this.pieceComponents[index];
            // TODO: update the display of selected piece:
            curtPiece.updatePosition(position.x, position.y);
            this.pieceComponents[index].updatePosition(position.x, position.y);
            if (this.pieceImageIndices[index] !== imageIndex) {
              const src = this.pieces[index].pieceImages[imageIndex];
              this.pieceComponents[index].updateImage(imageIndex, src);
              const newImage = new Image();
              newImage.onload = function() {
                // we pass the image() object directly:
                curtPiece.updateImage(newImage);
                // TODO: need to call parent layer draw!!!
                this.pieceCanvas.draw();
              };
              newImage.src = src;
              // TODO: canvas layer draw:
              this.pieceImageIndices[index] = imageIndex;
            }
            curtPiece.updateZDepth(zDepth);
          }
          // TODO: decks no need to display???
        });
      }
    });
  }

  updateWhenChange() {

  }

  startPieceListener(matchRef) {
    // should update if the other player moves the piece
    // TODO: could replace all the other snapshotchanges to this:
    matchRef.child('pieces').on('child_changed', snap => {
      if (snap.exists()) {
        // note this piece is the changed ne:
        const index = snap.key;
        const piece = snap.val();
        const zDepth = piece.currentState.zDepth;
        const position = {
          x: piece.currentState.x / 100 * this.width,
          y: piece.currentState.y / 100 * this.height
        };
        const imageIndex = piece.currentState.currentImageIndex;
        if (index < this.pieceComponents.length) {
          const curtPiece = this.pieceComponents[index];
          // TODO: update the display of selected piece:
          curtPiece.updatePosition(position.x, position.y);
          this.pieceComponents[index].updatePosition(position.x, position.y);
          if (this.pieceImageIndices[index] !== imageIndex) {
            const src = this.pieces[index].pieceImages[imageIndex];
            this.pieceComponents[index].updateImage(imageIndex, src);
            const newImage = new Image();
            newImage.onload = function() {
              // we pass the image() object directly:
              curtPiece.updateImage(newImage);
              // TODO: need to call parent layer draw!!!
              this.pieceCanvas.draw();
            };
            newImage.src = src;
            // TODO: canvas layer draw:
            this.pieceImageIndices[index] = imageIndex;
          }
          curtPiece.updateZDepth(zDepth);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO: different changes invoke different handlers
    this.updateWhenChange();
  }
}
