import React, { useState } from 'react';
import "./Tictactoe.css"
const Board = ({ squares, onClick }) => {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <div key={index} className={`square ${square}`} onClick={() => onClick(index)}>
          {square}
        </div>
      ))}
    </div>
  );
};

const Tictactoe = () => {
  const initialSquares = Array(9).fill(null);
  const [squares, setSquares] = useState(initialSquares);
  const [xIsNext, setXIsNext] = useState(true);
  const [difficulty, setDifficulty] = useState('easy');

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null);
  };
  
  const getRandomMove = (squares) => {
    const emptySquares = [];
    squares.forEach((square, index) => {
      if (!square) {
        emptySquares.push(index);
      }
    });
    if (emptySquares.length > 0) {
      return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }
    return null;
  };

  const getMediumMove = (squares) => {
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const copy = squares.slice();
        copy[i] = 'O';
        if (calculateWinner(copy) === 'O') {
          return i;
        }
      }
    }
    
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const copy = squares.slice();
        copy[i] = 'X';
        if (calculateWinner(copy) === 'X') {
          return i;
        }
      }
    }
    return getRandomMove(squares);
  };

  const getHardMove = (squares) => {
    const emptySquares = squares.reduce((acc, square, index) => {
      if (!square) {
        acc.push(index);
      }
      return acc;
    }, []);
  
    let bestScore = -Infinity;
    let bestMove;
  
    emptySquares.forEach((index) => {
      const copy = squares.slice();
      copy[index] = 'O';
      const score = minimax(copy, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    });
  
    return bestMove;
  };
  
  const minimax = (squares, depth, isMaximizing) => {
    const winner = calculateWinner(squares);
    if (winner) {
      return winner === 'O' ? 10 - depth : depth - 10;
    } else if (isBoardFull(squares)) {
      return 0;
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      squares.forEach((square, index) => {
        if (!square) {
          const copy = squares.slice();
          copy[index] = 'O';
          const score = minimax(copy, depth + 1, false);
          bestScore = Math.max(bestScore, score);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      squares.forEach((square, index) => {
        if (!square) {
          const copy = squares.slice();
          copy[index] = 'X';
          const score = minimax(copy, depth + 1, true);
          bestScore = Math.min(bestScore, score);
        }
      });
      return bestScore;
    }
  };

  const getBotMove = (squares, difficulty) => {
    switch (difficulty) {
      case 'easy':
        return getRandomMove(squares);
      case 'medium':
        return getMediumMove(squares);
      case 'hard':
        return getHardMove(squares);
      default:
        return null;
    }
  };

  const handleClick = (index) => {
    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
  
    if (!calculateWinner(newSquares)) {
      const botIndex = getBotMove(newSquares, difficulty);
      if (botIndex !== null) {
        newSquares[botIndex] = 'O';
        setSquares(newSquares);
      }
    }
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleRestart = () => {
    // Обработчик нажатия на кнопку "начать заново"
    setSquares(initialSquares);
    setXIsNext(true);
  };

  const winner = calculateWinner(squares);
  const status = winner
    ? `Победитель: ${winner}`
    : isBoardFull(squares)
    ? 'Ничья'
    : `Следующий игрок: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          Выбор сложности:
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Легко</option>
            <option value="medium">Средний</option>
            <option value="hard">Невозможный</option>
          </select>
        </div>
        <button className="button-tic" onClick={handleRestart}>Обновить</button>
      </div>
    </div>
  );
};

export default Tictactoe;