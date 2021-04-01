import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    /** initialize random number between 0 and 99, check number against probability */
    const initialLight = () => {
      const randNum = Math.floor(Math.random() * 100)
      return chanceLightStartsOn < randNum ? false : true
    }

    for (let i=0; i < nrows; i++) {
      initialBoard.push([])
      for (let j=0; j< ncols; j++) {
        initialLight() ? initialBoard[i].push({x: i, y: j, isLit: true}) : initialBoard[i].push({x: i, y: j, isLit: false})
      }
    }
    return initialBoard;
  }

  function hasWon() {
    const isLit = (cell) => {
      return cell.isLit
    }
    return board.every(row => row.every(cell => !isLit(cell)))
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x].isLit = !boardCopy[y][x].isLit;
        }
        if (x+1 >= 0 && x+1 < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x+1].isLit = !boardCopy[y][x+1].isLit;
        }
        if (x-1 >= 0 && x-1 < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x-1].isLit = !boardCopy[y][x-1].isLit;
        }
        if (x >= 0 && x < ncols && y+1 >= 0 && y+1 < nrows) {
          boardCopy[y+1][x].isLit = !boardCopy[y+1][x].isLit;
        }
        if (x >= 0 && x < ncols && y-1 >= 0 && y-1 < nrows) {
          boardCopy[y-1][x].isLit = !boardCopy[y-1][x].isLit;
        }
      };

      const newBoard = [...oldBoard];
      flipCell(y, x, newBoard)
      return newBoard
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  return ( hasWon() ? <h2 className="Board-win">You won!</h2> :
    <table className="Board-table">
      <tbody>
      {board.map((row, rowIdx) => (
        <tr key={rowIdx}>
        {row.map((cell,idx) => (
          <Cell key={idx} flipCellsAroundMe={() => flipCellsAround(`${cell.x} - ${cell.y}`)} isLit={cell.isLit}/>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  )
}

// default board has 5 rows/cols and 50% chance every cell is lit

Board.defaultProps = {
  nrows: 5,
  ncols: 5,
  chanceLightStartsOn: 50
};

export default Board;
