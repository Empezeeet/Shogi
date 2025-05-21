const game = {
  board: [],
  currentPlayer: 'White',
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
    black: '王',
    white: '玉',
    moves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ]
  },
  rook: {
    black: '飛',
    white: '飛',
    moves: [
      [-1, 0, 'mult'],
      [1, 0, 'mult'],
      [0, -1, 'mult'],
      [0, 1, 'mult']
    ],
    promotedChar: '龍',
    promotedMoves: [
      [-1, 0, 'mult'],
      [1, 0, 'mult'],
      [0, -1, 'mult'],
      [0, 1, 'mult'],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1]
    ]
  },
  bishop: {
    black: '角',
    white: '角',
    moves: [
      [-1, -1, 'mult'],
      [-1, 1, 'mult'],
      [1, -1, 'mult'],
      [1, 1, 'mult']
    ],
    promotedChar: '馬',
    promotedMoves: [
      [-1, -1, 'mult'],
      [-1, 1, 'mult'],
      [1, -1, 'mult'],
      [1, 1, 'mult'],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ]
  },
  goldGeneral: {
    black: '金',
    white: '金',
    moves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0]
    ]
  },
  silverGeneral: {
    black: '銀',
    white: '銀',
    moves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [1, 1],
      [1, -1]
    ],
    promotedChar: '全',
    promotedMoves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0]
    ]
  },
  knight: {
    black: '桂',
    white: '桂',
    moves: [
      [-2, -1],
      [-2, 1]
    ],
    promotedChar: '圭',
    promotedMoves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0]
    ]
  },
  lance: {
    black: '香',
    white: '香',
    moves: [
      [-1, 0, 'mult']
    ],
    promotedChar: '杏',
    promotedMoves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0]
    ]
  },
  pawn: {
    black: '歩',
    white: '歩',
    moves: [
      [-1, 0]
    ],
    promotedChar: 'と',
    promotedMoves: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0]
    ]
  }
};

/**
 * Tworzenie/resetowanie planszy
 */
function initBoard() {
  const boardContainer = document.getElementById('board');

  boardContainer.innerHTML = '';
  game.board = [];
  game.currentPlayer = 'White';
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

  addPiece(1, 1, createPiece('lance', 'black'));
  addPiece(1, 2, createPiece('knight', 'black'));
  addPiece(1, 3, createPiece('silverGeneral', 'black'));
  addPiece(1, 4, createPiece('goldGeneral', 'black'));
  addPiece(1, 5, createPiece('king', 'black'));
  addPiece(1, 6, createPiece('goldGeneral', 'black'));
  addPiece(1, 7, createPiece('silverGeneral', 'black'));
  addPiece(1, 8, createPiece('knight', 'black'));
  addPiece(1, 9, createPiece('lance', 'black'));

  addPiece(2, 2, createPiece('bishop', 'black'));
  addPiece(2, 8, createPiece('rook', 'black'));

  for (let col = 1; col <= 9; col++) {
    addPiece(3, col, createPiece('pawn', 'black'));
  }

  addPiece(9, 1, createPiece('lance', 'white'));
  addPiece(9, 2, createPiece('knight', 'white'));
  addPiece(9, 3, createPiece('silverGeneral', 'white'));
  addPiece(9, 4, createPiece('goldGeneral', 'white'));
  addPiece(9, 5, createPiece('king', 'white'));
  addPiece(9, 6, createPiece('goldGeneral', 'white'));
  addPiece(9, 7, createPiece('silverGeneral', 'white'));
  addPiece(9, 8, createPiece('knight', 'white'));
  addPiece(9, 9, createPiece('lance', 'white'));

  addPiece(8, 2, createPiece('rook', 'white'));
  addPiece(8, 8, createPiece('bishop', 'white'));

  for (let col = 1; col <= 9; col++) {
    addPiece(7, col, createPiece('pawn', 'white'));
  }
}

/**
 * Inicjalizuje nasłuchiwanie zdarzeń w grze
 */
function initGameEvents() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    cell.addEventListener('click', () => handleCellClick(row, col));
  });

  document.getElementById('promote-yes').addEventListener('click', () => handlePromotion(true));
  document.getElementById('promote-no').addEventListener('click', () => handlePromotion(false));
}

window.onload = function () {
  initBoard();
  initGameEvents();
  updateCapturedPiecesDisplay();
  updateGameStatus();
};