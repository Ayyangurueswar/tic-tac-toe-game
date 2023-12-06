import { useState } from "react";


function Square({value, onSquareClick}){
  return (
    <button className="square" onClick={onSquareClick}>{value}</button>
  );
}

function Board({xIsNext, squares, onPlay}){
  function handleClick(i){
    if(squares[i] || gameOver(squares)){
      return;
    }
    const nextState = squares.slice();
    if(xIsNext){
      nextState[i] = "X";
    }
    else{
      nextState[i] = "O";
    }
    onPlay(nextState); 
  }
  const result = winner(squares, xIsNext);
  const items = Array(3).fill(0);
  const squareItem = Array(3).fill(0);
  return (
    <div>
      <div className="status">{result}</div>
      {items.map((_, i)=>(
          <div className="board-row" key={i}>
            {squareItem.map((_, j)=>(
              <Square key={3*i+j} value={squares[3*i+j]} onSquareClick={()=>{handleClick(3*i+j)}} />
            ))}
          </div>
      ))}
    </div>
  );
}
function gameOver(squares){
  const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  for(let i=0; i<8; i++){
    const [a, b, c] = lines[i];
    if(squares[a] != null && squares[b] != null && squares[c] != null && squares[a] === squares[b] && squares[b] === squares[c]){
      return squares[a];
    }
  }
  return null;
}
function winner(squares, xIsNext){
  const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  for(let i=0; i<8; i++){
    const [a, b, c] = lines[i];
    if(squares[a] != null && squares[b] != null && squares[c] != null && squares[a] === squares[b] && squares[b] === squares[c]){
      return `Winner: ${squares[a]}`;
    }
  }
  for(let i=0; i<9; i++){
    if(squares[i] == null){
      return `Next player: ${xIsNext ? "X" : "O"}`;
    }
  }
  return "Draw";
}
export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currMove, setCurrMove] = useState(0);
  const currentSquares = history[currMove];
  const xIsNext = currMove%2 == 0;
  const [sortOrder, setSortOrder] = useState(true);
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currMove+1), nextSquares]
    setHistory(nextHistory);
    setCurrMove(nextHistory.length-1);
  }
  function jumpTo(nextMove){
    setCurrMove(nextMove);
  }
  function createButtons(history){
    const moves = history.map((_,move) => {
      if(move == 0){
        return (
          <li key={move}>
          <button onClick={()=>{jumpTo(move)}} className="infoButton">{`Go to game start`}</button>
        </li>
        )
      }
      return (
        <li key={move}>
          <button onClick={()=>{jumpTo(move)}} className="infoButton">{`Go to move #${move}`}</button>
        </li>
      )
    });
    if(!sortOrder){
      const startButton = moves[0];
      const result = moves.slice(1).reverse();
      return [startButton, ...result];
    }
    return moves;
  }
  const buttons = createButtons(history);
  return (
      <div className="game">
        <div className="game-board">
          <h1>Tic Tac Toe</h1>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        </div>
        <div className="info">
          <ol>{buttons}</ol>
        </div>
        {currMove != 0 && <button className="infoButton"
        onClick={()=>{setSortOrder(!sortOrder);}}>{`Sort in ${sortOrder ? "descending" : "ascending"} order`}</button>}
      </div>
  )
} 