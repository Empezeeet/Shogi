/**
 * Tworzy nową figurę
 * @param {string} type - Rodzaj figury
 * @param {string} color - Kolor figury
 * @returns {object} - Obiekt reprezentujący figurę
 */
function createPiece(type, color) {
    return {
        type: type,
        color: color,
        promoted: false
    }
}

/**
 * Dodaje figurę do planszy
 * @param {number} row - Wiersz, w którym ma być dodana figura
 * @param {number} col - Kolumna, w której ma być dodana figura
 * @param {object} piece - Figura do dodania
 */
function addPiece(row, col, piece) {
    if (!piece) {
        return;
    }

    game.board[row][col] = piece;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    const pieceElement = document.createElement('div');
    pieceElement.className = `piece ${piece.color}`;
    if (piece.promoted) {
        pieceElement.classList.add('promoted');
    }

    let pieceChar = pieces[piece.type][piece.color];
    if (piece.promoted && pieces[piece.type][piece.color].promotedChar) {
        pieceChar = pieces[piece.type][piece.color].promotedChar;
    }

    pieceElement.textContent = pieceChar;
    cell.appendChild(pieceElement);
}

/**
 * Usuwa figurę z planszy
 * @param {number} row - Wiersz, z którego ma być usunięta figura
 * @param {number} col - Kolumna, z której ma być usunięta figura
 * @returns {object} - Usunięta figura
 */
function removePiece(row, col) {
    const piece = game.board[row][col];
    game.board[row][col] = null;

    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const pieceElement = cell.querySelector('.piece');

    if (pieceElement) {
        cell.removeChild(pieceElement);
    }

    return piece;
}

/**
 * Promuje figurę
 * @param {object} piece - Figura do promowania
 * @param {number} row - Wiersz figury
 * @param {number} col - Kolumna figury
 */
function promotePiece(piece, row, col) {
    piece.promoted = true;

    removePiece(row, col);
    addPiece(row, col, piece);
}

/**
 * Rusza figurę na planszy
 * @param {number} fromRow - Wiersz startowy
 * @param {number} fromCol - Kolumna startowa
 * @param {number} toRow - Docelowy wiersz
 * @param {number} toCol - Docelowa kolumna
 * @returns {boolean} - Czy ruch był udany
 */
function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = game.board[fromRow][fromCol];

    if (!piece) {
        return false;
    }

    if (!isValidMove(fromRow, fromCol, toRow, toCol)) {
        return false;
    }

    const capturedPiece = game.board[toRow][toCol];
    if (capturedPiece) {
        capturePiece(capturedPiece, toRow, toCol);
    }

    removePiece(fromRow, fromCol);
    addPiece(toRow, toCol, piece);

    const canPromote = checkPromotion(piece, toRow);

    if (canPromote) {
        game.awaitingPromotion = {
            piece: piece,
            row: toRow,
            col: toCol
        };

        showPromotionDialog(toRow, toCol);
        return true;
    }

    endTurn();
    return true;
}