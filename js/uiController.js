/**
 * Aktualizuje wyświetlanie wziętych figur
 */
function updateCapturedPiecesDisplay() {
    const playerCapturedContainer = document.getElementById('player-captured');
    const aiCapturedContainer = document.getElementById('ai-captured');

    playerCapturedContainer.innerHTML = '';
    aiCapturedContainer.innerHTML = '';

    game.capturedPieces.white.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = `piece captured-piece white`;

        let pieceChar = pieces[piece.type][piece.color];
        pieceElement.textContent = pieceChar;

        pieceElement.addEventListener('click', () => {
            if (game.currentPlayer.toLowerCase() === 'white') {
                selectDropPiece(piece);
            }
        });

        playerCapturedContainer.appendChild(pieceElement);
    });

    game.capturedPieces.black.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = `piece captured-piece black`;

        let pieceChar = pieces[piece.type][piece.color];
        pieceElement.textContent = pieceChar;

        aiCapturedContainer.appendChild(pieceElement);
    });
}

/**
 * Podświetla prawidłowe ruchy na planszy
 * @param {Array} validMoves - Tablica prawidłowych pozycji ruchu
 */
function highlightValidMoves(validMoves) {
    clearMoveHighlights();

    validMoves.forEach(move => {
        const cell = document.querySelector(`.cell[data-row="${move.row}"][data-col="${move.col}"]`);
        cell.classList.add('moveHighlight');
    });
}

/**
 * Czyści wszystkie podświetlone komórki
 */
function clearHighlights() {
    clearMoveHighlights();
    clearPieceHighlights();
}

/**
 * Czyści podświetlenia ruchów
 */
function clearMoveHighlights() {
    const highlightedCells = document.querySelectorAll('.moveHighlight');
    highlightedCells.forEach(cell => {
        cell.classList.remove('moveHighlight');
    });
}

/**
 * Czyści podświetlenia figur
 */
function clearPieceHighlights() {
    const highlightedCells = document.querySelectorAll('.pieceHighlight');
    highlightedCells.forEach(cell => {
        cell.classList.remove('pieceHighlight');
    });
}

/**
 * Pokazuje okno dialogowe promocji
 * @param {number} row - Wiersz figury
 * @param {number} col - Kolumna figury
 */
function showPromotionDialog(row, col) {
    const promotionDialog = document.getElementById('promotion-dialog');
    const promotionOverlay = document.getElementById('promotion-overlay');

    promotionDialog.style.display = 'flex';
    promotionOverlay.style.display = 'block';
}

/**
 * Obsługuje kliknięcie komórki dla wyboru i ruchu figury
 * @param {number} row - Wiersz klikniętej komórki
 * @param {number} col - Kolumna klikniętej komórki
 */
function handleCellClick(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (game.awaitingPromotion) {
        return;
    }

    if (!game.selectedPiece) {
        const piece = game.board[row][col];

        if (piece && piece.color.toLowerCase() === game.currentPlayer.toLowerCase()) {
            game.selectedPiece = {
                row: row,
                col: col,
                piece: piece,
                fromHand: false
            };

            const validMoves = findValidMoves(row, col, piece);
            game.validMoves = validMoves;
            highlightValidMoves(validMoves);

            cell.classList.add('pieceHighlight');
        }
    } else {
        if (game.selectedPiece.fromHand) {
            const isValidDrop = game.validMoves.some(move => move.row === row && move.col === col);

            if (isValidDrop) {
                dropPiece(game.selectedPiece.piece, row, col);
            }

            clearHighlights();
            game.selectedPiece = null;
            game.validMoves = [];
        } else {
            const fromRow = game.selectedPiece.row;
            const fromCol = game.selectedPiece.col;

            if (row === fromRow && col === fromCol) {
                clearHighlights();
                game.selectedPiece = null;
                game.validMoves = [];
                return;
            }

            const isValidMove = game.validMoves.some(move => move.row === row && move.col === col);

            if (isValidMove) {
                movePiece(fromRow, fromCol, row, col);
            }

            clearHighlights();
            game.selectedPiece = null;
            game.validMoves = [];

            const piece = game.board[row][col];
            if (piece && piece.color.toLowerCase() === game.currentPlayer.toLowerCase() && !game.awaitingPromotion) {
                handleCellClick(row, col);
            }
        }
    }
}

/**
 * Aktualizuje wyświetlanie statusu gry
 */
function updateGameStatus() {
    const statusElement = document.getElementById('game-status');
    if(isKingCaptured('white')) {
        game.gameOver = true;
        alert('Game Over - Black wins!');
        game.currentPlayer = '-';
        game.validMoves = [];
        game.selectedPiece = null;
    }
    if(isKingCaptured('black')) {
        game.gameOver = true;
        alert('Game Over - White wins!');
        game.currentPlayer = '-';
        game.validMoves = [];
        game.selectedPiece = null;
    }

    if (game.gameOver) {
        statusElement.textContent = `Game Over - ${game.currentPlayer === 'white' ? 'Black' : 'White'} wins!`;
    } else {
        statusElement.textContent = `Current turn: ${game.currentPlayer}`;
    }
}

/**
 * Zaznacza kliknięte pole z figurą na planszy
 * @param {number} row - Wiersz
 * @param {number} col - Kolumna
 */
function highlightPieceCell(row, col) {
    let hasPiece = true;
    let currentHighlightedCell = document.querySelector('.pieceHighlight');
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (cell.querySelector('.piece') === null || cell.querySelector('.piece').classList.contains('black')) {
        hasPiece = false;
    }

    if (hasPiece) {
        if (cell.classList.contains('pieceHighlight')) {
            cell.classList.remove('pieceHighlight');
        } else {
            currentHighlightedCell?.classList.remove('pieceHighlight');
            cell.classList.add('pieceHighlight');
        }
    } else {
        return;
    }
}