const game = {
    board: [],
    currentPlayer: '',
    selectedPiece: null
}

/**
 * Tworzenie/resetowanie planszy
 */
function initBoard(){
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';
    game.board = [];

    game.currentPlayer = 'white';


    // Utworzenie planszy
    for (let row = 0; row < 9; row++) {
      game.board[row] = [];
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement('div');
        cell.className = `cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', () => highlightCell(row, col)); // Klikniecie na pole
        boardContainer.appendChild(cell);

        game.board[row][col] = null;
      }
    }
}

window.onload = function() {
            initBoard();
        };