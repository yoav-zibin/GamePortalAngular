import {Component, AfterViewInit, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {PieceComponent} from '../piece/piece.component';
import {Observable} from 'rxjs/Observable';
import * as Konva from 'konva';

// const Konva = require('konva');
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

// Test:
// export class GameComponent implements AfterViewInit {
//   @Input() board: any;
//   @Input() pieces: any;
//   @Input() matchRef: any;
//   constructor() {
//     console.log('entering constructor');
//   }
//   ngAfterViewInit() {
//     console.log('helo');
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     const stage = new Konva.Stage({
//       container: 'container',
//       width: width,
//       height: height
//     });
//     const layer = new Konva.Layer();
//     const rect = new Konva.Rect({
//       x: 50,
//       y: 50,
//       width: 100,
//       height: 50,
//       fill: 'green',
//       stroke: 'black',
//       strokeWidth: 4
//     });
//
//     const rect2 = new Konva.Rect({
//       x: 100,
//       y: 100,
//       width: 100,
//       height: 50,
//       fill: 'green',
//       stroke: 'black',
//       strokeWidth: 4
//     });
//     // add the shape to the layer
//     // add the layer to the stage
//     stage.add(layer);
//     layer.add(rect);
//     stage.draw();
//     setTimeout(() => {
//       console.log('im in change rect');
//       // rect.setSize({
//       //   width: 300,
//       //   height: 300
//       // });
//       console.log('asdasdas', rect);
//       console.log('ffff', rect as any);
//       (rect as any).to({
//         x: 100,
//         y: 100
//       });
//       console.log('im in changed rect');
//       console.log('im drawing changed rect');
//       layer.draw();
//       stage.draw();
//     }, 1000);
//   }
// }



export class GameComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() board: any;
  @Input() pieces: any;
  @Input() matchRef: any;
  @ViewChildren(PieceComponent) pieceComponents: QueryList<PieceComponent>;
  pieceImageIndices: Array<any>;
  pieceImages: Array<Konva.Image>;
  boardImage: Konva.Image;
  stage: Konva.Stage;
  piecesLayer: Konva.Layer;
  boardLayer: Konva.Layer;
  configStage;
  width: number;
  height: number;
  constructor() {
    this.width  = 600;
    this.height = 600;
  }

  ngOnInit() {
    this.pieceImageIndices = new Array(this.pieces.length).fill(0);
    // TODO: not sure this fill works
    this.pieceImages = new Array(this.pieces.length).fill(new Konva.Image({
      image: new Image(),
      draggable: true
    }));
    this.boardImage = new Konva.Image({
      image: new Image(),
      draggable: false
    });
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: 'stage',
      width: this.width,
      height: this.height
    });
    this.boardLayer = new Konva.Layer();
    this.piecesLayer = new Konva.Layer();
    // add board image and piece images to both layers
    this.boardLayer.add(this.boardImage);
    for (const image of this.pieceImages) {
      this.piecesLayer.add(image);
    }
    this.setCurtState(this.matchRef);
    // this.startPieceListener(this.matchRef);
  }

  // TODO: make sure load from current state!
  setCurtState(matchRef) {
    // load board image:
    const boardSrc = this.board.src;
    const boardimg = new Image();
    const boardLayer = this.boardLayer;
    boardimg.onload = function () {
      boardLayer.draw();
    };
    boardimg.src = boardSrc;

    // matchRef.child('pieces').once('value').then(snap => {
    //   if (snap.exists()) {
    //     const pieces = snap.val();
    //     pieces.forEach((piece, index) => {
    //       const position = {
    //         // piece.currentState stores the percentage
    //         x: piece.currentState.x / 100 * this.width,
    //         y: piece.currentState.x / 100 * this.height
    //       };
    //       const zDepth = piece.currentState.zDepth;
    //       const imageIndex = piece.currentState.currentImageIndex;
    //       if (index < this.pieceComponents.length) {
    //         const curtPiece = this.pieceComponents[index];
    //         // TODO: update the display of selected piece:
    //         curtPiece.updateDisplayPosition(position.x, position.y);
    //         this.pieceComponents[index].updatePosition(position.x, position.y);
    //         if (this.pieceImageIndices[index] !== imageIndex) {
    //           const src = this.pieces[index].pieceImages[imageIndex];
    //           this.pieceComponents[index].updateImage(imageIndex, src);
    //           const newImage = new Image();
    //           newImage.onload = function() {
    //             // we pass the image() object directly:
    //             curtPiece.updateImage(newImage);
    //             // TODO: need to call parent layer draw!!!
    //             this.pieceCanvas.draw();
    //           };
    //           newImage.src = src;
    //           // TODO: canvas layer draw:
    //           this.pieceImageIndices[index] = imageIndex;
    //         }
    //         curtPiece.updateZDepth(zDepth);
    //       }
    //       // TODO: decks no need to display???
    //     });
    //   }
    // });
  }

  updateWhenChange() {

  }

  // startPieceListener(matchRef) {
  //   // should update if the other player moves the piece
  //   // TODO: could replace all the other snapshotchanges to this:
  //   matchRef.child('pieces').on('child_changed', snap => {
  //     if (snap.exists()) {
  //       // note this piece is the changed ne:
  //       const index = snap.key;
  //       const piece = snap.val();
  //       const zDepth = piece.currentState.zDepth;
  //       const position = {
  //         x: piece.currentState.x / 100 * this.width,
  //         y: piece.currentState.y / 100 * this.height
  //       };
  //       const imageIndex = piece.currentState.currentImageIndex;
  //       if (index < this.pieceComponents.length) {
  //         const curtPiece = this.pieceComponents[index];
  //         // TODO: update the display of selected piece:
  //         curtPiece.updatePosition(position.x, position.y);
  //         this.pieceComponents[index].updatePosition(position.x, position.y);
  //         if (this.pieceImageIndices[index] !== imageIndex) {
  //           const src = this.pieces[index].pieceImages[imageIndex];
  //           this.pieceComponents[index].updateImage(imageIndex, src);
  //           const newImage = new Image();
  //           newImage.onload = function() {
  //             // we pass the image() object directly:
  //             curtPiece.updateImage(newImage);
  //             // TODO: need to call parent layer draw!!!
  //             this.pieceCanvas.draw();
  //           };
  //           newImage.src = src;
  //           // TODO: canvas layer draw:
  //           this.pieceImageIndices[index] = imageIndex;
  //         }
  //         curtPiece.updateZDepth(zDepth);
  //       }
  //     }
  //   });
  // }

  ngOnChanges(changes: SimpleChanges): void {
    // // TODO: different changes invoke different handlers
    // this.updateWhenChange();
  }
}
