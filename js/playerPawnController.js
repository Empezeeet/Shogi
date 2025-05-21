/**
 * Sprawdza, czy ruch jest prawidłowy
 * @param {number} fromRow - Wiersz startowy
 * @param {number} fromCol - Kolumna startowa
 * @param {number} toRow - Docelowy wiersz
 * @param {number} toCol - Docelowa kolumna
 * @returns {boolean} - Czy ruch jest prawidłowy
 */
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = game.board[fromRow][fromCol];
    if (!piece) {
        return false;
    }
    if (piece.color.toLowerCase() !== game.currentPlayer.toLowerCase()) {
        return false;
    }

    const validMoves = findValidMoves(fromRow, fromCol, piece);
    return validMoves.some(move => move.row === toRow && move.col === toCol);
}

/**
 * Bierze figurę z planszy
 * @param {object} piece - Figura do wzięcia
 * @param {number} row - Wiersz, z którego ma być wzięta figura
 * @param {number} col - Kolumna, z której ma być wzięta figura
 */
function capturePiece(piece, row, col) {
    const capturedPiece = removePiece(row, col);

    capturedPiece.promoted = false;
    capturedPiece.color = game.currentPlayer.toLowerCase();
    game.capturedPieces[game.currentPlayer.toLowerCase()].push(capturedPiece);

    updateCapturedPiecesDisplay();
}

/**
 * Wybiera figurę do zrzucenia na planszę
 * @param {object} piece - Figura do zrzucenia
 */
function selectDropPiece(piece) {
    clearHighlights();

    game.selectedPiece = {
        piece: piece,
        fromHand: true
    };

    const validDrops = findValidDrops(piece);
    game.validMoves = validDrops;

    highlightValidMoves(validDrops);
}

/**
 * Znajduje prawidłowe miejsca do zrzucenia figury
 * @param {object} piece - Figura do zrzucenia
 * @returns {Array} - Tablica z prawidłowymi miejscami do zrzucenia
 */
function findValidDrops(piece) {
    const validDrops = [];

    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            if (game.board[row][col] !== null) {
                continue;
            }
            let isValid = true;

            if (piece.type === 'pawn') {
                for (let r = 1; r <= 9; r++) {
                    const existingPiece = game.board[r][col];
                    if (existingPiece &&
                        existingPiece.type === 'pawn' &&
                        existingPiece.color === piece.color &&
                        !existingPiece.promoted) {
                        isValid = false;
                        break;
                    }
                }

                if (piece.color === 'white' && row === 1) {
                    isValid = false;
                } else if (piece.color === 'black' && row === 9) {
                    isValid = false;
                }
            }

            if (piece.type === 'lance') {
                if (piece.color === 'white' && row === 1) {
                    isValid = false;
                } else if (piece.color === 'black' && row === 9) {
                    isValid = false;
                }
            }

            if (piece.type === 'knight') {
                if (piece.color === 'white' && (row === 1 || row === 2)) {
                    isValid = false;
                } else if (piece.color === 'black' && (row === 9 || row === 8)) {
                    isValid = false;
                }
            }

            if (isValid) {
                validDrops.push({
                    row,
                    col
                });
            }
        }
    }

    return validDrops;
}

/**
 * Zrzuca figurę z ręki na planszę
 * @param {object} piece - Figura do zrzucenia
 * @param {number} row - Wiersz do zrzucenia
 * @param {number} col - Kolumna do zrzucenia
 */
function dropPiece(piece, row, col) {
    const playerPieces = game.capturedPieces[game.currentPlayer.toLowerCase()];
    const index = playerPieces.findIndex(p => p === piece);

    if (index !== -1) {
        playerPieces.splice(index, 1);
    }

    addPiece(row, col, piece);

    updateCapturedPiecesDisplay();

    endTurn();
}

/**
 * Obsługuje wybór promocji
 * @param {boolean} promote - Czy promować figurę
 */
function handlePromotion(promote) {
    const promotionDialog = document.getElementById('promotion-dialog');
    const promotionOverlay = document.getElementById('promotion-overlay');

    if (!game.awaitingPromotion) {
        return;
    }

    const {
        piece,
        row,
        col
    } = game.awaitingPromotion;

    if (promote) {
        promotePiece(piece, row, col);
    }

    promotionDialog.style.display = 'none';
    promotionOverlay.style.display = 'none';

    game.awaitingPromotion = null;

    endTurn();
}

/**
 * Kończy aktualną turę i zmienia graczy
 */
function endTurn() {
    game.currentPlayer = game.currentPlayer === 'white' ? 'black' : 'white';

    updateGameStatus();

    if (game.currentPlayer.toLowerCase() === 'black') {
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

/**
 * Znajduje prawidłowe ruchy dla figury
 * @param {number} row - Wiersz figury
 * @param {number} col - Kolumna figury
 * @param {object} piece - Figura do sprawdzenia
 * @returns {Array} - Tablica z prawidłowymi ruchami
 */
function findValidMoves(row, col, piece) {
    const validMoves = [];
    let moves;

    if (pieces[piece.type].promotedMoves) {
        moves = pieces[piece.type].promotedMoves;
    } else {
        moves = pieces[piece.type].moves;
    }

    const direction = piece.color === 'black' ? 1 : -1;

    for (const move of moves) {
        const moveRow = move[0] * direction;
        const moveCol = move[1];
        let isMult = move[2] === 'mult';

        let currentRow = row + moveRow;
        let currentCol = col + moveCol;

        do {
            if (currentRow < 1 || currentRow > 9 || currentCol < 1 || currentCol > 9) {
                break;
            }

            const targetPiece = game.board[currentRow][currentCol];

            if (!targetPiece) {
                validMoves.push({
                    row: currentRow,
                    col: currentCol
                });
            } else if (targetPiece.color !== piece.color) {
                validMoves.push({
                    row: currentRow,
                    col: currentCol
                });
                break;
            } else {
                break;
            }

            if (!isMult) break;

            currentRow += moveRow;
            currentCol += moveCol;
        } while (isMult);
    }

    return validMoves;
}

/**
 * Sprawdza możliwość promocji figury
 * @param {object} piece - Figura do sprawdzenia
 * @param {number} row - Wiersz figury
 * @returns {boolean} - Czy figura może być promowana
 */
function checkPromotion(piece, row) {
    if (piece.type === 'king' || piece.type === 'gold' || piece.promoted) {
        return false;
    }

    const inPromotionZone = game.promotionZone[piece.color].includes(row);

    if (inPromotionZone) {
        if (piece.type === 'pawn' || piece.type === 'lance') {
            if ((piece.color === 'black' && row === 1) || (piece.color === 'white' && row === 9)) {
                return true;
            }
        } else if (piece.type === 'knight') {
            if ((piece.color === 'black' && (row === 1 || row === 2)) ||
                (piece.color === 'white' && (row === 9 || row === 8))) {
                return true;
            }
        }

        return true;
    }

    return false;
}

/**
 * Sprawdza, czy król został złapany
 * @param {string} color - Kolor króla do sprawdzenia
 * @returns {boolean} - Czy król został złapany
 */
function isKingCaptured(color) {
  const kingChar = color === 'white' ? '王' : '玉';
  
  const capturedPiecesContainers = document.querySelectorAll('.captured-pieces');
  for (const container of capturedPiecesContainers) {
    const capturedPieces = container.querySelectorAll('.captured-piece');
    
    for (const piece of capturedPieces) {
      if (piece.textContent.includes(kingChar)) {
        return true;
      }
    }
  }
  return false;
}