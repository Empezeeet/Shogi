const game = {
  board: [],
  currentPlayer: '',
  selectedPiece: null,
  validMoves: [],
  capturedPieces: {
    white: [],
    black: []
  },
  promotionZone: {
    white: [1, 2, 3],
    black: [7, 8, 9]
  },
  awaitingPromotion: null,
  inCheck: {
    white: false,
    black: false
  },
  gameOver: false
}

const pieces = {
  king: {
    black: '',
    white: '',
    moves: []
  },

  rook: {
    black: '',
    white: '',
    moves: [],
    promotedChar: '',
    promotedMoves: []
  },

  bishop: {
    black: '',
    white: '',
    moves: [],
    promotedChar: '',
    promotedMoves: []
  },

  goldKing: {
    black: '',
    white: '',
    moves: [],
  },

  silverKing: {
    black: '',
    white: '',
    moves: [],
  },

  knight: {
    black: '',
    white: '',
    moves: [],
    promotedChar: '',
    promotedMoves: []
  },

  lance: {
    black: '',
    white: '',
    moves: [],
    promotedChar: '',
    promotedMoves: []
  },

  pawn: {
    black: '',
    white: '',
    moves: [],
    promotedChar: '',
    promotedMoves: []
  }
}

/**
 * Tworzenie/resetowanie planszy
 */
function initBoard() {
  const boardContainer = document.getElementById('board');

  boardContainer.innerHTML = '';
  game.board = [];
  game.currentPlayer = 'white';
  game.selectedPiece = null;
  game.validMoves = [];
  game.capturedPieces = {
    white: [],
    black: []
  };
  game.awaitingPromotion = null;
  game.inCheck = {
    white: false,
    black: false
  };
  game.gameOver = false;


  // Utworzenie planszy
  for (let row = 1; row < 10; row++) {
    game.board[row] = [];
    for (let col = 1; col < 10; col++) {
      const cell = document.createElement('div');
      cell.className = `cell`;
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', () => highlightPieceCell(row, col)); // Klikniecie na pole
      boardContainer.appendChild(cell);

      game.board[row][col] = null;
    }
  }

  // Ustawienie pionków
  placePiece(1, 1, createPiece('lance', 'white'));
}

window.onload = function () {
  initBoard();
};