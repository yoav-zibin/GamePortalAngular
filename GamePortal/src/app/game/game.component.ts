import {Component, AfterViewInit, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';
import {PieceComponent} from '../piece/piece.component';
import {Observable} from 'rxjs/Observable';
import * as Konva from 'konva';
/// const Konva = require('konva');

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
  // dont need the piece component
  // @ViewChildren(PieceComponent) pieceComponents: QueryList<PieceComponent>;
  pieceImageIndices: Array<any>;
  pieceImages: Array<Konva.Image>;
  boardImage: Konva.Image;
  stage: Konva.Stage;
  piecesLayer: Konva.Layer;
  boardLayer: Konva.Layer;
  maxSize: number;
  boardHeight: number;
  boardWidth: number;
  constructor() {
    this.maxSize = 650;
  }

  ngOnInit() {
    this.pieceImageIndices = new Array(this.pieces.length).fill(-1);
    // TODO: not sure this fill works
    // each piece could have multiple images
    // but only have one to display:
    this.pieceImages = new Array(this.pieces.length);
    for (let i = 0; i < this.pieces.length; i++) {
      this.pieceImages[i] = new Konva.Image({
        image: new Image(),
        draggable: true
        // remember to set the width and height later on!
      });
    }
    this.boardImage = new Konva.Image({
      image: new Image(),
      width: this.maxSize,
      height: this.maxSize,
      draggable: false
    });
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: 'stage',
      width: this.maxSize,
      height: this.maxSize
    });
    this.boardLayer = new Konva.Layer();
    this.piecesLayer = new Konva.Layer();
    // add board image and piece images to both layers
    this.boardLayer.add(this.boardImage);
    for (const image of this.pieceImages) {
      this.piecesLayer.add(image);
    }
    this.stage.add(this.boardLayer);
    this.stage.add(this.piecesLayer);
    this.setCurtState(this.matchRef);
    // this.startPieceListener(this.matchRef);
  }

  updateBoardImage(boardKonvaImage, boardSrc, aspectRatio) {
    const boardImgObj = new Image();
    const boardLayer = this.boardLayer;
    let newHeight: number;
    let newWidth: number;
    if (aspectRatio > 1) {
      newHeight = this.maxSize;
      newWidth = this.maxSize / aspectRatio;
    } else {
      newWidth = this.maxSize;
      newHeight = this.maxSize * aspectRatio;
    }
    this.boardHeight = newHeight;
    this.boardWidth = newWidth;
    boardImgObj.onload = function () {
      // must set size before set image!
      boardKonvaImage.setAttrs({
        width: newWidth,
        height: newHeight
      });
      (boardKonvaImage as any).setImage(boardImgObj);
      boardLayer.draw();
    };
    boardImgObj.src = boardSrc;
  }

  // Note this is the display position!
  updatePiecePosition(pieceKonvaImage, newX, newY) {
    (pieceKonvaImage as any).to({
      x: newX,
      y: newY,
      duration: 0.3
    });
  }

  updatePieceImage(pieceKonvaImage, pieceSrc, newWidth?, newHeight?) {
    const pieceImgObj = new Image();
    const pieceLayer = this.piecesLayer;
    console.log('setting new image!');
    pieceImgObj.onload = function () {
      console.log('setting new width!', newWidth);
      console.log('setting new height!', newHeight);
      if (newWidth && newHeight) {
        console.log('setting new height!');
        pieceKonvaImage.setAttrs({
          width: newWidth,
          height: newHeight
        });
      }
      (pieceKonvaImage as any).setImage(pieceImgObj);
      pieceLayer.draw();
    };
    pieceImgObj.src = pieceSrc;
  }

  // TODO: make sure load from current state!
  setCurtState(matchRef) {
    // load board image:
    const boardTrueHeight = this.board.height;
    console.log('boardTrueHeight!', boardTrueHeight);
    const boardTrueWidth = this.board.width;
    console.log('boardTrueWidth!', boardTrueWidth);
    const boardSrc = this.board.src;
    this.updateBoardImage(this.boardImage, boardSrc, boardTrueHeight / boardTrueWidth);
    // Load pieces
    // Load piece images:
    matchRef.child('pieces').once('value').then(snap => {
      if (snap.exists()) {
        const pieces = snap.val();
        const thiz = this;
        pieces.forEach((piece, index) => {
          // TODO: update position first or img first?
          const position = {
            // piece.currentState stores the percentage
            x: piece.currentState.x / 100 * this.boardWidth,
            y: piece.currentState.y / 100 * this.boardHeight
          };
          const zDepth = piece.currentState.zDepth;
          const imageIndex = piece.currentState.currentImageIndex;
          if (index < this.pieces.length) {
            const selfDfPiece = thiz.pieces[index];
            const pieceSrc = selfDfPiece.urls[imageIndex];
            const pieceKonvaImage = thiz.pieceImages[index];
            // First: position; then image!

            // update position:;
            thiz.updatePiecePosition(pieceKonvaImage, position.x, position.y);

            // update image:
            if (thiz.pieceImageIndices[index] !== imageIndex) {
              console.log('piece width!', piece.width);
              const newWidth = selfDfPiece.width / boardTrueWidth * thiz.boardWidth;
              console.log('new width!', newWidth);
              const newHeight = selfDfPiece.height / boardTrueHeight * thiz.boardHeight;
              console.log('new height!', newHeight);
              thiz.updatePieceImage(pieceKonvaImage, pieceSrc, newWidth, newHeight);
              // update current image index
              thiz.pieceImageIndices[index] = imageIndex;
            }

            // // update ZDepth
            // curtPieceComp.updateZDepth(zDepth);
          }
          // TODO: decks no need to display???
        });
      }
    });
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
    // TODO: have to first determine if the previous input props is null:
    // this.updateWhenChange();
    console.log(changes);
    // console.log('im in ngOnchanges');
    // if (changes.pieces.previousValue !== null) {
    //   console.log('pieces PREVIOUS VALUE!', changes.pieces.previousValue);
    // }
    // if (changes.pieces.previousValue !== changes.pieces.currentValue) {
    //   console.log('pieces changed!');
    // }
    // if (changes.matchRef.previousValue !== changes.matchRef.currentValue) {
    //   console.log('matchRef changed!');
    // }
    // if (changes.board.previousValue !== changes.board.currentValue) {
    //   console.log('board changed!');
    // }
    if (!changes.board || changes.board.isFirstChange()) {
      return;
    }
    if (changes.board) {
      console.log('you board');
    }
    const boardSrc = this.board.src;
    console.log('boardSrc: ', boardSrc);
    const boardImgObj = new Image();
    const boardLayer = this.boardLayer;
    const thiz = this;
    boardImgObj.onload = function () {
      (thiz.boardImage as any).setImage(boardImgObj);
      console.log('Im in onChanges!! this.boardImage: ', thiz.boardImage);
      boardLayer.draw();
      thiz.stage.draw();
    };
    boardImgObj.src = boardSrc;
  }
}
