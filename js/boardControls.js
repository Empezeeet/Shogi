function highlightCell(row, col) {
    let hasPiece = true; // TODO: Sprawdzanie czy jest pionek
    let currentHighlightedCell = document.querySelector('.highlight');

    if (hasPiece) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('highlight')) {
            cell.classList.remove('highlight');
        }
        else {
            currentHighlightedCell?.classList.remove('highlight');
            cell.classList.add('highlight');
        }
    }
    else {
        return;
    }
}