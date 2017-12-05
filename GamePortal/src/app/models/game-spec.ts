// may have to adjust according to rules:
export class GameSpec {
  $gameSpecId?: string;
  uploaderEmail?: string;
  uploaderUid?: string;
  createdOn?: number;
  gameName?: string;
  // imageId
  gameIcon50x50?: string;
  gameIcon512x512?: string;
  wikiUrl?: string;
  tutorialYoutubeVideo?: string;
  board: {
    imageId?: string;
    backgroundColor?: string;
    maxScale?: number;
  };
  pieces: {
    $pieceIndex?: {
      // elementId
      pieceElementId?: string;
      initialState?: {
        x?: number;
        y?: number;
        zDepth?: number;
        currentImageIndex?: number;
        cardVisibility?: {
          $participantIndex?: {
            boolean;
          };
        };
        rotatioDnegrees?: number;
        drawing: {
          $drwaingId?: {
            userId?: string;
            timestamp?: number;
            color?: number;
            linkThickness?: number;
            fromX?: number;
            fromY?: number;
            toX?: number;
            toY?: number;
          };
        };
      };
      deckPieceIndex?: number;
    };
  };
}
