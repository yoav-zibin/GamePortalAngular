import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  updatePosition(newX, newY) {
    this.image.to({
      x: newX,
      y: newY,
      duration: 0.5
    });
  }

  updateImage(image) {
    this.image.setImage(image);
  }

  updateZDepth(zDepth) {

  }
}
