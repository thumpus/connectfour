/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
const currPlayerText = document.getElementById("currPlayerText");
let currPlayer = 1; // active player: 1 or 2
let board =  []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  board.length = HEIGHT;
  for (let y = 0; y < HEIGHT; y++){
    let widthArray = []
    for (let x=0; x < WIDTH; x++){
      widthArray.push(null);
    }
    board[y] = widthArray;
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  const top = document.createElement("tr"); //creates a new tr element called top
  top.setAttribute("id", "column-top"); //sets the to row's id to be column top
  top.addEventListener("click", handleClick); //adds the event listener to the top boxes

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td"); //makes a new td 
    headCell.setAttribute("id", x); //gives that new td a value equal to its x position
    top.append(headCell); //appends the new tile to the top
  } //this loops until there are as many tiles on the top as the WIDTH value
  htmlBoard.append(top); //appends the top to the htmlBoard. this happens before the rest of the board so naturally it will appear up top.

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr"); //makes the row constant and sets it equal to a new tr
    for (let x = 0; x < WIDTH; x++) { 
      const cell = document.createElement("td"); //makes the cell constant and sets it equal to a new td
      cell.setAttribute("id", `${y}-${x}`); //sets the ID's of each cell to its appropriate x and y coordinates
      row.append(cell); //puts a cell on each row, until the WIDTH value is reached
    }
    htmlBoard.append(row); //adds the row the htmlBoard. this loop will stop once the height of the board has reached the HEIGHT value.
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--){
    if (board[y][x] === null){
      return y;
    } else if (board[0][x] > 0){
      window.alert("You can't put another piece in that column.")
      return null;
      break;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const newPiece = document.createElement("div");
  newPiece.classList.add('piece', `p${currPlayer}`)
  const curCell = document.getElementById(`${y}-${x}`);
  curCell.append(newPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  window.alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin(true)) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
      return endGame('tie.');
    }

  // switch players
  if (currPlayer === 1){
    currPlayer = 2
    currPlayerText.innerText = "Player 2's turn!"
    currPlayerText.classList.add("c2")
    currPlayerText.classList.remove("c1")
  } else if (currPlayer === 2) {
    currPlayer = 1
    currPlayerText.innerText = "Player 1's turn!"
    currPlayerText.classList.add("c1")
    currPlayerText.classList.remove("c2")
  }
 
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
