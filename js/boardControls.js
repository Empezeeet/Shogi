/**
 * Zaznacza kliknięte pole z figurą na planszy
 * @param {number} row - Wiersz
 * @param {number} col - Kolumna
 */
function highlightPieceCell(row, col) {
    let hasPiece = true; // TODO: Sprawdzanie czy jest pionek
    let currentHighlightedCell = document.querySelector('.pieceHighlight');

    if (hasPiece) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('pieceHighlight')) {
            cell.classList.remove('pieceHighlight');
        }
        else {
            currentHighlightedCell?.classList.remove('pieceHighlight');
            cell.classList.add('pieceHighlight');
        }
    }
    else {
        return;
    }
}