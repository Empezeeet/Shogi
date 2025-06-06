function getValidMoves() {
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
    return validMoves;
}
// zwraca wartosc figury.
function getPieceValue(piece) {
    // Prosta funkcja zwracająca wartość figury
    // Można rozszerzyć o bardziej złożoną logikę
    let value = 0;
    switch (piece.type) {
        case 'king':
            value = 1000; // Król ma najwyższą wartość
            break;
        case 'goldGeneral':
            value = 5; break; // Złoty generał
        case 'silverGeneral':
            value = 5; break; // Srebrny generał
        case 'knight':
            value = 3; break; // Rycerz
        case 'lance':
            value = 3; break;// Lancet
        case 'bishop':
            value = 8; break; // Goniec
        case 'rook':
            value = 9; break; // Wieża
        case 'pawn':
            value = 1; break; // Pionek
        default:
            return NaN; // Nieznana figura
    }
    value *= piece.promoted ? 10 : 1;
    return value;
}
// liczy wartosc figur AI i odejmuje wartosc figur przeciwnika
// nie mam zielonego pojecia jak ta funckja dziala razem z findBestMove ale dziala calkiem niezle (nie uzylem chatgpt)
function evaluateAIPosition(newBoard) {
    
    let score = 0;
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const piece = newBoard[row][col];
            
            if (piece && piece.color.toLowerCase() === 'black') {
                score += getPieceValue(piece);
            } else if (piece && piece.color.toLowerCase() === 'white') {
                score -= getPieceValue(piece);
            }
            // if piece is closer to the opponent side, increase score
            if (piece && piece.color.toLowerCase() === 'black' && piece.type != "king") {
                score += (9 - row)*2; // closer to the opponent side
            } else if (piece && piece.color.toLowerCase() === 'white') {
                score -= (9-row)*2;
            }
            // if piece is promoted, increase score
            if (piece && piece.promoted) {
                score += 2;
            }
            // if piece is closer to the center (horizontal and vertical), increase score
            if (piece && piece.color.toLowerCase() === 'black') {
                if (col >= 4 && col <= 6) {
                    score -= 1; // closer to the center
                }
                if (row >= 4 && row <= 6) {
                    score -= 1; // closer to the center
                }
            } else if (piece && piece.color.toLowerCase() === 'white') {
                if (col >= 4 && col <= 6) {
                    score += 1; // closer to the center
                }
                if (row >= 4 && row <= 6) {
                    score += 1; // closer to the center
                }
            }

        }
    }
    let whitePiecesCount = newBoard.flat().filter(piece => piece && piece.color.toLowerCase() === 'white').length;
    let blackPiecesCount = newBoard.flat().filter(piece => piece && piece.color.toLowerCase() === 'black').length;
    score -= (blackPiecesCount - whitePiecesCount) * 10000; // bonus for more pieces
    
    return score;
}

function findBestMove(validMoves) {
    if (validMoves.length === 0) {
        console.log("No valid moves for AI");
        return null; // Brak dostępnych ruchów
    }

    let bestMove = null;
    let bestScore = Infinity;
    for (const move of validMoves) {
        let newBoard = JSON.parse(JSON.stringify(game.board)); // board po wykonaniu ruchu.
        if (move.fromHand) {
            return move; // jesli mozeesz postawic nowa figure to zrob to.
        }
        
        if (newBoard[move.toRow][move.toCol] && newBoard[move.toRow][move.toCol].type === 'king') {
            return move; // jesli mozesz zbic krola to zrob to.
        }
        let piece = newBoard[move.fromRow][move.fromCol];
        newBoard[move.toRow][move.toCol] = piece; // move piece
        let newScore = evaluateAIPosition(newBoard); 
        if (newScore < bestScore) {
            bestScore = newScore;
            bestMove = move;
        }
    }
    console.log("best score: " + bestScore);
    console.log("best move: " + JSON.stringify(bestMove));
    return bestMove;
    
}






/**
 * Wykonuje ruch dla AI (Czarny) 
*/
function makeAIMove() {
    const validMoves = getValidMoves();
    // jesli AI ma zajete figury to moze je postawic jako swoje.
    // 
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
        let bestMove = findBestMove(validMoves);
        if (!bestMove) {
            // jak nie ma ruchu to losuj :)
            console.log("random move");
            bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        if (bestMove.fromHand) { // postaw firgury ktore przejalem. (jesli taka instnieje)
            console.log("T");
            const piece = bestMove.piece;
            const playerPieces = game.capturedPieces.black;
            const index = playerPieces.findIndex(p => p === piece);

            if (index !== -1) {
                playerPieces.splice(index, 1);
            }

            addPiece(bestMove.toRow, bestMove.toCol, piece);
            updateCapturedPiecesDisplay();
        } else {
            console.log("F");
            const piece = game.board[bestMove.fromRow][bestMove.fromCol];

            const capturedPiece = game.board[bestMove.toRow][bestMove.toCol];
            if (capturedPiece) {
                capturePiece(capturedPiece, bestMove.toRow, bestMove.toCol);
            }

            removePiece(bestMove.fromRow, bestMove.fromCol);
            addPiece(bestMove.toRow, bestMove.toCol, piece);

            const canPromote = checkPromotion(piece, bestMove.toRow);
            if (canPromote) {
                promotePiece(piece, bestMove.toRow, bestMove.toCol);
            }
        }

        endTurn();
    } else {
        game.gameOver = true;
        updateGameStatus();
    }
}