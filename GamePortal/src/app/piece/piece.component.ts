import {Component, Input, OnInit} from '@angular/core';
import * as Konva from 'konva';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {
  @Input() layer: Konva.Layer;
  @Input() img: Konva.Image;
  constructor() {
  }

  ngOnInit() {
    console.log('im in piece component');
  }

  updateDisplayPosition(newX, newY) {
    this.img.to({

    });
  }

  // updateImage(image) {
  //   this.image.setImage(image);
  // }
  //
  // updateZDepth(zDepth) {
  //
  // }
}
