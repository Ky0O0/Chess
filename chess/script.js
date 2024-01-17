document.addEventListener("DOMContentLoaded", function (){
  const chessboard = document.getElementById("chessboard");
  const colLabels = document.getElementById("col-labels");
  const capturedPiecesContainer = document.getElementById("captured-pieces");
  let selectedPiece = null;
  let isWhiteTurn = true;

  const capturedPieces ={
    white: [],
    black: [],
  };

  const pieces ={
    "white-king": "white-king.png",
    "white-queen": "white-queen.png",
    "white-rook": "white-rook.png",
    "white-bishop": "white-bishop.png",
    "white-knight": "white-knight.png",
    "white-pawn": "white-pawn.png",
    "black-king": "black-king.png",
    "black-queen": "black-queen.png",
    "black-rook": "black-rook.png",
    "black-bishop": "black-bishop.png",
    "black-knight": "black-knight.png",
    "black-pawn": "black-pawn.png",
  };

  function createChessboard(){
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
          const square = document.createElement("div");
          square.className = `square ${((row + col) % 2 === 0) ? 'white-square' : 'black-square'}`;
          square.dataset.row = row;
          square.dataset.col = col;
          square.addEventListener("click", () => handleSquareClick(row, col));
          chessboard.appendChild(square);
        }
      }
    }

  function addPiece(piece, row, col){
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    const pieceElement = document.createElement("div");
    pieceElement.className = "piece";
    pieceElement.style.backgroundImage = `url(${pieces[piece]})`;
    square.appendChild(pieceElement);
  }

  function addLabels(){
    for(let i = 1; i < 9; i++){
      const label = document.createElement("div");
      label.className = "row-label";
      label.textContent = String.fromCharCode(96 + i);
      chessboard.appendChild(label);
    } for (let i = 8; i > 0; i--){
        const label = document.createElement("div");
        label.className = "col-label";
        label.textContent = i;
        colLabels.appendChild(label);
      }
  }

  function initializeChessboard(){
    createChessboard();
    addLabels();
    addPiece("white-king", 7, 4);
    addPiece("white-queen", 7, 3);
    addPiece("white-rook", 7, 0);
    addPiece("white-rook", 7, 7);
    addPiece("white-bishop", 7, 2);
    addPiece("white-bishop", 7, 5);
    addPiece("white-knight", 7, 1);
    addPiece("white-knight", 7, 6);
    for (let col = 0; col < 8; col++){
      addPiece("white-pawn", 6, col);
    }
    addPiece("black-king", 0, 4);
    addPiece("black-queen", 0, 3);
    addPiece("black-rook", 0, 0);
    addPiece("black-rook", 0, 7);
    addPiece("black-bishop", 0, 2);
    addPiece("black-bishop", 0, 5);
    addPiece("black-knight", 0, 1);
    addPiece("black-knight", 0, 6);
    for (let col = 0; col < 8; col++){
      addPiece("black-pawn", 1, col);
    }
  }

  function handleSquareClick(row, col){
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    const piece = square.querySelector(".piece");
    if (selectedPiece){
      const selectedRow = parseInt(selectedPiece.parentElement.dataset.row);
      const selectedCol = parseInt(selectedPiece.parentElement.dataset.col);
      square.innerHTML = "";
      square.appendChild(selectedPiece);
      selectedPiece = null;
      removeHighlights();
      switchTurn();
    }else{
      if (piece && ((isWhiteTurn && piece.style.backgroundImage.includes("white")) || (!isWhiteTurn && piece.style.backgroundImage.includes("black")))){
        selectedPiece = piece;
        highlightPossibleMoves(row, col);
      }
    }
  }

  function highlightPossibleMoves(row, col){
    removeHighlights();
    const pieceType = getPieceType(selectedPiece);
    const possibleMoves = getPieceMoves(pieceType, row, col);
    possibleMoves.forEach(move =>{
    const targetSquare = document.querySelector(`.square[data-row="${move.row}"][data-col="${move.col}"]`);
    targetSquare.classList.add("possible-move");
    });
  }

  function removeHighlights(){
    const highlightedSquares = document.querySelectorAll('.possible-move');
    highlightedSquares.forEach(square => square.classList.remove('possible-move'));
  }

  function getPieceType(pieceElement){
    for (const type in pieces){
      if (pieces.hasOwnProperty(type) && pieces[type] === pieceElement.style.backgroundImage.slice(5, -2)){
        return type;
      }
    }
    return null;
  }

  function switchTurn(){
    isWhiteTurn = !isWhiteTurn;
    updateCapturedPieces();
  }

  function updateCapturedPieces(){
    capturedPiecesContainer.innerHTML = "";
    capturedPieces.white.forEach(piece =>{
      const pieceElement = document.createElement("div");
      pieceElement.className = "captured-piece";
      pieceElement.style.backgroundImage = `url(${pieces[piece]})`;
      capturedPiecesContainer.appendChild(pieceElement);
    });
    capturedPieces.black.forEach(piece =>{
      const pieceElement = document.createElement("div");
      pieceElement.className = "captured-piece";
      pieceElement.style.backgroundImage = `url(${pieces[piece]})`;
      capturedPiecesContainer.appendChild(pieceElement);
    });
  }

  function getPieceMoves(pieceType, row, col){
    switch (pieceType){
      case "white-king":
      case "black-king":
        return getKingMoves(row, col);
      case "white-queen":
      case "black-queen":
        return getQueenMoves(row, col);
      case "white-rook":
      case "black-rook":
        return getRookMoves(row, col);
      case "white-bishop":
      case "black-bishop":
        return getBishopMoves(row, col);
      case "white-knight":
      case "black-knight":
        return getKnightMoves(row, col);
      case "white-pawn":
      case "black-pawn":
        return getPawnMoves(row, col, pieceType);
        default:
          return [];
    }
  }

  function getKingMoves(row, col){
    return [
      { row: row - 1, col: col },
      { row: row - 1, col: col + 1 },
      { row: row, col: col + 1 },
      { row: row + 1, col: col + 1 },
      { row: row + 1, col: col },
      { row: row + 1, col: col - 1 },
      { row: row, col: col - 1 },
      { row: row - 1, col: col - 1 },
    ];
  }

  function getQueenMoves(row, col){
    return getRookMoves(row, col).concat(getBishopMoves(row, col));
  }

  function getRookMoves(row, col){
    const moves = [];
    for (let i = 0; i < 8; i++){
      if (i !== row){
        moves.push({ row: i, col: col });
      }
      if (i !== col){
        moves.push({ row: row, col: i });
      }
    }
    return moves;
  }

  function getBishopMoves(row, col){
    const moves = [];
    for (let i = 1; i < 8; i++){
      if (row + i < 8 && col + i < 8){
        moves.push({ row: row + i, col: col + i });
      }
      if (row - i >= 0 && col - i >= 0){
        moves.push({ row: row - i, col: col - i });
      }
      if (row + i < 8 && col - i >= 0){
        moves.push({ row: row + i, col: col - i });
      }
      if (row - i >= 0 && col + i < 8){
        moves.push({ row: row - i, col: col + i });
      }
    }
      return moves;
  }

  function getKnightMoves(row, col){
    const moves = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 },
    ];
    return moves.filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8);
  }

  function getPawnMoves(row, col, pieceType){
    const moves = [];
    const direction = (pieceType.includes("white")) ? -1 : 1;
    if (row + direction >= 0 && row + direction < 8){
       moves.push({ row: row + direction, col: col });
    }
    if (
        ((pieceType.includes("white") && row === 6) || (pieceType.includes("black") && row === 1)) &&
        row + 2 * direction >= 0 &&
        row + 2 * direction < 8
        ){
      moves.push({ row: row + 2 * direction, col: col });
    }
    if (row + direction >= 0 && row + direction < 8){
      if (col - 1 >= 0){
        moves.push({ row: row + direction, col: col - 1 });
      }
      if (col + 1 < 8){
        moves.push({ row: row + direction, col: col + 1 });
      }
    }
    return moves;
  }
  initializeChessboard();
});