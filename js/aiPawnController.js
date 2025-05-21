/**
 * Wykonuje ruch dla AI (Czarny) Obecnie losowy ruch
 */
function makeAIMove() {
    const validMoves = [];
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const piece = game.board[row][col];
            if (piece && piece.color.toLowerCase() === 'black') {
                const moves = findValidMoves(row, col, piece);
                moves.forEach(move => {
                    validMoves.push({
                        fromRow: row,
                        fromCol: col,
                        toRow: move.row,
                        toCol: move.col
                    });
                });
            }
        }
    }

    game.capturedPieces.black.forEach(piece => {
        const drops = findValidDrops(piece);
        drops.forEach(drop => {
            validMoves.push({
                piece: piece,
                fromHand: true,
                toRow: drop.row,
                toCol: drop.col
            });
        });
    });

    if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

        if (randomMove.fromHand) {
            const piece = randomMove.piece;
            const playerPieces = game.capturedPieces.black;
            const index = playerPieces.findIndex(p => p === piece);

            if (index !== -1) {
                playerPieces.splice(index, 1);
            }

            addPiece(randomMove.toRow, randomMove.toCol, piece);
            updateCapturedPiecesDisplay();
        } else {
            const piece = game.board[randomMove.fromRow][randomMove.fromCol];

            const capturedPiece = game.board[randomMove.toRow][randomMove.toCol];
            if (capturedPiece) {
                capturePiece(capturedPiece, randomMove.toRow, randomMove.toCol);
            }

            removePiece(randomMove.fromRow, randomMove.fromCol);
            addPiece(randomMove.toRow, randomMove.toCol, piece);

            const canPromote = checkPromotion(piece, randomMove.toRow);
            if (canPromote) {
                promotePiece(piece, randomMove.toRow, randomMove.toCol);
            }
        }

        endTurn();
    } else {
        game.gameOver = true;
        updateGameStatus();
    }
}