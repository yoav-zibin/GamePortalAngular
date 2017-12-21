import {
  Component, AfterViewInit, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren,
  OnDestroy, ElementRef
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as Konva from 'konva';
import {GroupService} from '../services/group.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

// TODO: implement tooltip and options for card!!!
export class GameComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() board: any;
  @Input() pieces: {};
  @Input() matchRef: any;
  @ViewChild('container') canvasContainer: ElementRef;

  // this keeps track of images "displayed"! It should be equal to currentImageIndex
  pieceImageIndices: Array<any>;
  pieceImages: Array<Konva.Image>;
  boardImage: Konva.Image;
  stage: Konva.Stage;
  tooltip: Konva.Label;
  piecesLayer: Konva.Layer;
  boardLayer: Konva.Layer;
  tooltipLayer: Konva.Layer; // TODO: may want to try Konva.Label as tooltip
  maxSize: number;
  boardHeight: number;
  boardWidth: number;
  pieceMaxZDepth: number;
  participantsRef: any;
  userParticipantIdx: number;
  participantsNames: {}; // dict{participantIdx: displayname};
  cardVisibility: {}; // {pieceIdx: {participantIdx: true}}
  tooltipInfo: {};
  showCardOptions: boolean;
  clickCardIndex: number;
  clickDeckIndex: number;
  constructor(private auth: AuthService, private group: GroupService) {
    this.maxSize = 600;
    this.pieceMaxZDepth = 0;
  }

  ngOnInit() {
    // grab the info for participants of this match
    const groupRef = this.group.getGroupRef();
    this.participantsRef = groupRef.child('participants');
    const thiz = this;
    this.participantsRef.on('value', (snap) => {
      const participants = snap.val(); // dict{uid: participantIdx};
      thiz.userParticipantIdx = participants[this.auth.getCurtUid()].participantIndex;
      thiz.participantsNames = {};
      Object.keys(participants).forEach((uid) => {
        const userRef = this.auth.getUserRef(uid);
        const userNameRef = userRef.child('publicFields').child('displayName');
        userNameRef.once('value').then((userName) => {
          // Todo: this participantsNames is never used
          thiz.participantsNames[participants[uid].participantIndex] = userName.val();
        });
      });
    });

    this.pieceImageIndices = new Array(Object.keys(this.pieces).length).fill(-1);
    // TODO: not sure this fill works
    // each piece could have multiple images
    // but only have one to display:
    this.pieceImages = new Array(Object.keys(this.pieces).length);
    for (let i = 0; i < Object.keys(this.pieces).length; i++) {
      this.pieceImages[i] = new Konva.Image({
        image: new Image(),
        listening: true
        // remember to set the width and height later on!
      });
    }
    this.boardImage = new Konva.Image({
      image: new Image(),
      width: this.maxSize,
      height: this.maxSize,
      draggable: false
    });
    // this.tooltip = new Konva.Label({});
    this.showCardOptions = false;
    this.tooltipInfo = null;
    this.clickCardIndex = -1;
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: 'stage',
      width: this.maxSize * 1.05,
      height: this.maxSize * 1.05
    });
    this.boardLayer = new Konva.Layer();
    this.piecesLayer = new Konva.Layer();
    // this.tooltipLayer = new Konva.Layer();
    // add board image and piece images to both layers
    this.boardLayer.add(this.boardImage);
    for (const image of this.pieceImages) {
      this.piecesLayer.add(image);
    }
    // this.tooltipLayer.add(this.tooltip);
    this.stage.add(this.boardLayer);
    this.stage.add(this.piecesLayer);
    // this.stage.add(this.tooltipLayer);
    this.initCardVisibility();
    this.setCurtState(this.matchRef);
    this.startPieceListener(this.matchRef);
  }

  initCardVisibility() {
    const thiz = this;
    thiz.cardVisibility = {};
    Object.keys(thiz.pieces).forEach(index => {
      const piece = thiz.pieces[index];
      if (piece.kind === 'card') {
        thiz.cardVisibility[index] = null;
      }
    });
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
    pieceImgObj.onload = function () {
      // console.log('setting new width!', newWidth);
      // console.log('setting new height!', newHeight);
      if (newWidth && newHeight) {
        // console.log('setting new height!');
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

  // in both handler, we are dealing with ZDepth
  handleDragStart(pieceKonvaImage) {
    const pieceLayer = this.piecesLayer;
    pieceKonvaImage.moveToTop();
    this.pieceMaxZDepth = pieceKonvaImage.getZIndex();
    pieceLayer.draw();
  }

  handleDragEnd(pieceKonvaImage, index) {
    // will have to update position to database!
    const position = pieceKonvaImage.getAbsolutePosition();

    const newVals = {
      x: position.x / this.boardWidth * 100,
      y: position.y / this.boardHeight * 100,
      zDepth: ++this.pieceMaxZDepth
    };
    const pieceRef = this.matchRef.child('pieces').child(index).child('currentState').update(newVals);
  }

  updateZDepth(pieceKonvaImage, ZDepth) {
    const pieceLayer = this.piecesLayer;
    let zIndex;
    if (ZDepth) {
      zIndex = ZDepth;
    } else {
      zIndex = this.pieceMaxZDepth;
    }
    this.pieceMaxZDepth = Math.max(zIndex, this.pieceMaxZDepth);
    pieceKonvaImage.setZIndex(zIndex);
    pieceLayer.draw();
  }

  toggle(pieceKonvaImage, index, selfDfPiece) {
    // update to the next piece image:
    this.pieceImageIndices[index] = (this.pieceImageIndices[index] + 1) % selfDfPiece.urls.length;
    const nextImageIndex = this.pieceImageIndices[index];
    const position = pieceKonvaImage.getAbsolutePosition();
    const pieceImgObj = new Image();
    const pieceLayer = this.piecesLayer;
    const thiz = this;
    pieceImgObj.onload = function () {
      // note we dont have to rescale width and height
      (pieceKonvaImage as any).setImage(pieceImgObj);
      pieceLayer.draw();
    };
    pieceImgObj.src = selfDfPiece.urls[nextImageIndex];
    const newVals = {
      currentImageIndex: nextImageIndex,
      zDepth: ++thiz.pieceMaxZDepth
    };
    thiz.matchRef.child('pieces').child(index).child('currentState').update(newVals);
  }

  rollDice(pieceKonvaImage, index, selfDfPiece, onlyAnim?) {
    const position = pieceKonvaImage.getAbsolutePosition();
    const tween = new Konva.Tween({
      node: pieceKonvaImage,
      rotation: 360,
      easing: Konva.Easings.BounceEaseInOut,
      duration: 0.5
    });
    tween.play();
    setTimeout(function () {
      tween.reverse();
    }, 300);
    // if it is not "this" player clicked but another player clicked
    // then just display this change
    if (onlyAnim) {
      return;
    }
    const nextImageIndex = Math.floor(Math.random() * selfDfPiece.urls.length);
    if (this.pieceImageIndices[index] === nextImageIndex) {
      return;
    } else {
      const pieceLayer = this.piecesLayer;
      const pieceImgObj = new Image();
      const thiz = this;
      pieceImgObj.onload = function () {
        // note we dont have to rescale width and height
        (pieceKonvaImage as any).setImage(pieceImgObj);
        pieceLayer.draw();
      };
      pieceImgObj.src = selfDfPiece.urls[nextImageIndex];
      const newVals = {
        currentImageIndex: nextImageIndex,
        zDepth: ++thiz.pieceMaxZDepth
      };
      thiz.matchRef.child('pieces').child(index).child('currentState').update(newVals);
      thiz.pieceImageIndices[index] = nextImageIndex;
    }
  }

// TODO: when mouse over a card, show tool tip
  showToolTip(cardKonvaImage, index, selfDfPiece) {
    // this.tooltipLayer.destroyChildren();
    let selfVisibleTo = [];
    const selfCardVisibility = this.cardVisibility[index];
    if (selfCardVisibility) {
      const thiz = this;
      Object.keys(selfCardVisibility).forEach((participantIdx) => {
        selfVisibleTo.push(thiz.participantsNames[participantIdx]);
      });
    }
    const cardPosition = cardKonvaImage.getAbsolutePosition();
    const cardWidth = cardKonvaImage.getAttr('width');
    const canvasContainerX = this.canvasContainer.nativeElement.getBoundingClientRect().x;
    const tooltipPosition = {
      x: cardPosition.x + cardWidth + canvasContainerX,
      y: cardPosition.y
    };
//     this.tooltip = new Konva.Label({
//       x: tooltipPosition.x,
//       y: tooltipPosition.y,
//       opacity: 0.75,
//       visible: true
//     });
//
// // add a tag to the label
//     this.tooltip.add(new Konva.Tag({
//       fill: 'black',
//       pointerDirection: 'down',
//       pointerWidth: 10,
//       pointerHeight: 10,
//       lineJoin: 'round',
//       shadowColor: 'black',
//       shadowBlur: 10,
//       shadowOpacity: 0.5
//     }));
//     this.tooltip.add(new Konva.Text({
//       text: selfVisibleTo.toString(),
//       fontFamily: 'Calibri',
//       fontSize: 18,
//       padding: 5,
//       fill: 'white'
//     }));
    // console.log(this.tooltip.getAttr('visible'));
    // console.log('im in tooltip!!!', this.tooltip);
    // this.tooltipLayer.add(this.tooltip);
    // this.tooltip.show();
    // this.tooltipLayer.draw();
    this.tooltipInfo = {
      selectCardIndex: index,
      show: true,
      position: tooltipPosition,
      visibleTo: selfVisibleTo
    };
  }

  getTooltipPosition() {
    return this.tooltipInfo['position'];
  }
  // TODO: when click on a card, show options
  showOptions(cardKonvaImage, index, selfDfPiece) {
    this.clickDeckIndex = selfDfPiece.deckPieceIndex;
    if (this.clickCardIndex !== index) {
      this.showCardOptions = true; // html would do most work
      this.clickCardIndex = index;
    } else {
      this.showCardOptions = !this.showCardOptions;
    }
    // this.tooltip.setAttr('visible', false);
    this.tooltipInfo['show'] = false;
  }

  // TODO: implement 4 options:
  visibleToSelf() {
    this.hideToAll();
    const selectCardIndex = this.clickCardIndex;
    const path = `pieces/${selectCardIndex}/currentState/cardVisibility/${this.userParticipantIdx}`;
    const visibilityRef = this.matchRef.child(path);
    visibilityRef.set(true);
  }

  visibleToAll() {
    const selectCardIndex = this.clickCardIndex;
    const thiz = this;
    Object.keys(this.participantsNames).forEach((participantIndex) => {
      const path = `pieces/${selectCardIndex}/currentState/cardVisibility/${participantIndex}`;
      const visibilityRef = thiz.matchRef.child(path);
      visibilityRef.set(true);
    });
  }

  hideToAll() {
    const selectCardIndex = this.clickCardIndex;
    const path = `pieces/${selectCardIndex}/currentState/cardVisibility`;
    const visibilityRef = this.matchRef.child(path);
    visibilityRef.set(null);
  }

  shuffle() {
    // Note: only shuffle cards which belongs to deckPieceIndex
    const deckPieceIndex = this.clickDeckIndex;
    if (deckPieceIndex !== null) {
      let zIndicesArr = new Array(Object.keys(this.pieces).length);
      for (let i = 0; i < zIndicesArr.length; i++) {
        zIndicesArr[i] = i + 1;
      }
      // ref: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      let currentIndex = zIndicesArr.length;
      let temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // randomly pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // swap it with the current element.
        temporaryValue = zIndicesArr[currentIndex];
        zIndicesArr[currentIndex] = zIndicesArr[randomIndex];
        zIndicesArr[randomIndex] = temporaryValue;
      }
      Object.keys(this.pieces).forEach(index => {
        const piece = this.pieces[index];
        if (piece.deckPieceIndex === deckPieceIndex) {
          const backtoInitState = piece.initialState;
          const newzDepth = zIndicesArr[index];
          backtoInitState['zDepth'] = newzDepth;
          this.matchRef.child(`pieces/${index}/currentState`).set(backtoInitState);
        }
      });
    }
  }

  // TODO: when mouse out a card, hide tool tip
  hideToolTipandOptions() {
    // this.tooltip.setAttr('visible', false);
    this.tooltipInfo['show'] = false;
  }

  updateInitialPieces(matchRef, boardTrueWidth, boardTrueHeight) {
    // this is only called by setCurtState!!! not in listener
    const thiz = this;
    matchRef.child('pieces').once('value').then(snap => {
      if (snap.exists()) {
        const pieces = snap.val();
        const len = pieces.length;
        for (let index = 0; index < len; index++) {
          const piece = pieces[index];
          if (piece.currentState.x < 0 || piece.currentState.y < 0) {
            continue;
          }
          const position = {
            // piece.currentState stores the percentage
            x: piece.currentState.x / 100 * this.boardWidth,
            y: piece.currentState.y / 100 * this.boardHeight
          };
          const zDepth = piece.currentState.zDepth;
          let imageIndex = piece.currentState.currentImageIndex;
          if (index < Object.keys(this.pieces).length) {
            const selfDfPiece = thiz.pieces[index];
            const kind = selfDfPiece.kind;
            const draggable = selfDfPiece.draggable;
            const pieceKonvaImage = thiz.pieceImages[index];
            // update draggable:
            if (draggable || kind === 'standard') {
              pieceKonvaImage.setAttr('draggable', true);
            } else {
              pieceKonvaImage.setAttr('draggable', false);
            }
            // First: position; then image!
            // update position:;
            thiz.updatePiecePosition(pieceKonvaImage, position.x, position.y);

            // if deck, continue
            if (kind === 'cardsDeck' || kind === 'piecesDeck') {
              // for deck, no event listener.
              // note: in shuffle deck, kind === card
              continue;
            }
            // add drag handler to pieceKonvaImage:
            if (pieceKonvaImage.getAttr('draggable')) {
              // drag start
              pieceKonvaImage.on('dragstart', () => {
                thiz.handleDragStart(pieceKonvaImage);
              });
              // drag end
              pieceKonvaImage.on('dragend', () => {
                thiz.handleDragEnd(pieceKonvaImage, index);
              });
            }

            // add event handler:
            if (kind === 'card') {
              const cardVisibility = piece.currentState.cardVisibility;
              thiz.cardVisibility[index] = cardVisibility;
              // for card, mouse over, mouse out and click
              pieceKonvaImage.on('mouseover', () => {
                // TODO:
                thiz.showToolTip(pieceKonvaImage, index, selfDfPiece);
              });
              pieceKonvaImage.on('mouseout', () => {
                // TODO:
                thiz.hideToolTipandOptions();
              });
              pieceKonvaImage.on('click', () => {
                thiz.showOptions(pieceKonvaImage, index, selfDfPiece);
              });
            } else if (kind === 'toggable') {
              // click
              pieceKonvaImage.on('click', () => {
                thiz.toggle(pieceKonvaImage, index, selfDfPiece);
              });
            } else if (kind === 'dice') {
              // click
              pieceKonvaImage.on('click', () => {
                thiz.rollDice(pieceKonvaImage, index, selfDfPiece);
              });
            }

            // update image:
            // TODO: update other kind og pieces, such as card
            if (kind === 'card') {
              if (thiz.cardVisibility[index] && (thiz.cardVisibility[index][thiz.userParticipantIdx] !== null)) {
                // in case in the database, cardVisibility and imageIndex are inconsistent
                imageIndex = 1;
              } else {
                imageIndex = 0;
              }
            }
            const pieceSrc = selfDfPiece.urls[imageIndex];
            // console.log('ready to set image for piece: ', index);
            if (thiz.pieceImageIndices[index] !== imageIndex) {
              const newWidth = selfDfPiece.width / boardTrueWidth * thiz.boardWidth;
              const newHeight = selfDfPiece.height / boardTrueHeight * thiz.boardHeight;
              // console.log('updating piece image for index: ', index);
              // console.log('piece kind: ', kind);
              // console.log('imageIndex is: ', imageIndex);
              thiz.updatePieceImage(pieceKonvaImage, pieceSrc, newWidth, newHeight);

              // update current image index
              thiz.pieceImageIndices[index] = imageIndex;
            }

            // update ZDepth
            thiz.updateZDepth(pieceKonvaImage, zDepth);
          }
        }
      }
    });
  }

  // TODO: make sure load from current state!
  setCurtState(matchRef) {
    // load board image:
    const boardSrc = this.board.src;
    const boardTrueHeight = this.board.height;
    // console.log('boardTrueHeight!', boardTrueHeight);
    const boardTrueWidth = this.board.width;
    // console.log('boardTrueWidth!', boardTrueWidth);
    this.updateBoardImage(this.boardImage, boardSrc, boardTrueHeight / boardTrueWidth);
    // Load pieces
    // Load piece images:
    this.updateInitialPieces(this.matchRef, boardTrueWidth, boardTrueHeight);
  }

  startPieceListener(matchRef) {
    // should update if the other player moves the piece
    // TODO: could replace all the other snapshotchanges to this:
    const boardTrueHeight = this.board.height;
    const boardTrueWidth = this.board.width;
    // Load pieces
    // Load piece images:
    const thiz = this;
    matchRef.child('pieces').on('child_changed', snap => {
      if (snap.exists()) {
        const piece = snap.val();
        const index = snap.key;
        // console.log('有吗？？？', piece);
        const position = {
          // piece.currentState stores the percentage
          x: piece.currentState.x / 100 * this.boardWidth,
          y: piece.currentState.y / 100 * this.boardHeight
        };
        const zDepth = piece.currentState.zDepth;
        let imageIndex = piece.currentState.currentImageIndex;
        if (index < Object.keys(this.pieces).length) {
          const selfDfPiece = thiz.pieces[index];
          const kind = selfDfPiece.kind;
          const pieceKonvaImage = thiz.pieceImages[index];
          // First: position; then image!

          // update position:;
          thiz.updatePiecePosition(pieceKonvaImage, position.x, position.y);

          if (kind === 'cardsDeck' || kind === 'piecesDeck') {
            // for deck, no event listener.
            return;
          }

          // for card, we believe in visibility, since when user clicked, we change the visibility immediately
          if (kind === 'card') {
            const cardVisibility = piece.currentState.cardVisibility;
            thiz.cardVisibility[index] = cardVisibility;
            if (thiz.cardVisibility[index] && thiz.cardVisibility[index][thiz.userParticipantIdx]) {
              // in case in the database, cardVisibility and imageIndex are inconsistent
              imageIndex = 1;
            } else {
              imageIndex = 0;
            }
          }
          // update image:
          const pieceSrc = selfDfPiece.urls[imageIndex];
          if (thiz.pieceImageIndices[index] !== imageIndex) {
            // console.log('piece width!', piece.width);
            const newWidth = selfDfPiece.width / boardTrueWidth * thiz.boardWidth;
            // console.log('new width!', newWidth);
            const newHeight = selfDfPiece.height / boardTrueHeight * thiz.boardHeight;
            // console.log('new height!', newHeight);
            if (kind === 'dice') {
              // only show an animation
              thiz.rollDice(pieceKonvaImage, index, selfDfPiece, true);
            }
            // Note: only update the display of current piece image
            // did not write to the database!
            thiz.updatePieceImage(pieceKonvaImage, pieceSrc, newWidth, newHeight);
            // update current image index
            thiz.pieceImageIndices[index] = imageIndex;
          }

          // update ZDepth if shuffled or dragged
          thiz.updateZDepth(pieceKonvaImage, zDepth);
        }
      }
    });
  }

  removePieceListener(matchRef) {
      matchRef.child('pieces').off();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO: different changes invoke different handlers
    // TODO: have to first determine if the previous input props is null:
    // from the log, we know that when input changes, the order is:
    // matchRef -> board -> pieces
    if (changes.matchRef && !changes.matchRef.isFirstChange()) {
      // update board:
      this.showCardOptions = false;
      this.tooltipInfo = null;
      this.clickCardIndex = -1;
      return;
    }
    if (changes.board && !changes.board.isFirstChange()) {
      // update board:
      const boardTrueHeight = this.board.height;
      const boardTrueWidth =  this.board.width;
      // console.log('boardTrueWidth!', boardTrueWidth);
      const boardSrc = this.board.src;
      this.updateBoardImage(this.boardImage, boardSrc, boardTrueHeight / boardTrueWidth);
    }

    if (changes.pieces && !changes.pieces.isFirstChange()) {
      this.removePieceListener(this.matchRef);
      this.initCardVisibility();
      this.pieceImageIndices = new Array(Object.keys(this.pieces).length).fill(-1);
      this.pieceImages = new Array(Object.keys(this.pieces).length);
      for (let i = 0; i < Object.keys(this.pieces).length; i++) {
        this.pieceImages[i] = new Konva.Image({
          image: new Image(),
          draggable: true,
          listening: true
          // remember to set the width and height later on!
        });
      }
      this.piecesLayer.destroyChildren();
      for (const image of this.pieceImages) {
        this.piecesLayer.add(image);
      }
      const boardTrueHeight = this.board.height;
      const boardTrueWidth =  this.board.width;
      this.updateInitialPieces(this.matchRef, boardTrueWidth, boardTrueHeight);
      this.startPieceListener(this.matchRef);
    }
  }

  // on destroy
  ngOnDestroy(): void {
    this.participantsRef.off();
    this.matchRef.off();
  }
}
