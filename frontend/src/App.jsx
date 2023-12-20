import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";

function App() {
  /*----------------------------- STATE VARIABLES -----------------------------*/
  const [sampleJson, setSampleJson] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [boardSize, setBoardSize] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzle, setPuzzle] = useState([]);
  const [showSolvedPopup, setShowSolvedPopup] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [moveCount, setMoveCount] = useState(0);

  // Fetch initial data
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8084/api/v1/users/samples");
        setSampleJson(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getData();
  }, []);

  /*----------------------------- HANDLERS FOR GAME ACTIONS -----------------------------*/
  const handleNewGameClick = () => {
    setShowSolvedPopup(false);
    setShowModal(true);
  };
  const handleLeaderboardClick = () => { /* logic for leaderboard */ };
  const handleSettingsClick = () => { /* logic for settings */ };
  const handleReturnToMenu = () => {
    setGameStarted(false);
    setPuzzle([]);
    setBoardSize(null);
    setShowSolvedPopup(false);
  };

  /*----------------------------- SELECT BOARD SIZE -----------------------------*/
  const selectBoardSize = async (size) => {
    setBoardSize(size);
    setShowModal(false);
    try {
      const { data: newPuzzle } = await axios.get(`http://localhost:8084/api/v1/puzzle/new?size=${size}`);
      console.log(newPuzzle);
      setPuzzle(newPuzzle);
      setGameStarted(true);
    } catch (error) {
      console.error("Error fetching new puzzle: ", error);
    }
  };

  /*----------------------------- SWAP TILES -----------------------------*/
  const handleTileClick = (tile, rowIndex, tileIndex) => {

    // Function to find empty tile
    const findEmptyTile = (puzzle) => {
      for (let r = 0; r < puzzle.length; r++) {
        for (let c = 0; c < puzzle[r].length; c++) {
          if (puzzle[r][c] === 0) return { r, c };
        }
      }
      return null;
    };
  
    // Check if a move is valid and adjacent to the empty space
    const isValidMove = (tilePos, emptyPos) => {
      return (
        (tilePos.row === emptyPos.r && Math.abs(tilePos.column - emptyPos.c) === 1) ||
        (tilePos.column === emptyPos.c && Math.abs(tilePos.row - emptyPos.r) === 1)
      );
    };

    // Swap the clicked tile with the empty space
    const swapTiles = (puzzle, fromPos, toPos) => {
      const newPuzzle = puzzle.map(row => [...row]);
      newPuzzle[toPos.r][toPos.c] = newPuzzle[fromPos.row][fromPos.column];
      newPuzzle[fromPos.row][fromPos.column] = 0;
      return newPuzzle;
    };

    // Function to check if the puzzle is solved
    const isSolved = (puzzle) => {
      let number = 1;
      for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
          if (puzzle[i][j] !== number && !(i === puzzle.length - 1 && j === puzzle[i].length - 1)) {
            return false;
          }
          if (number === puzzle.length * puzzle[i].length - 1) return true; // Last number reached
          number++;
        }
      }
      return true;
    };

    const emptyTilePos = findEmptyTile(puzzle);
    if (isValidMove({ row: rowIndex, column: tileIndex }, emptyTilePos)) {
      const newPuzzle = swapTiles(puzzle, { row: rowIndex, column: tileIndex }, emptyTilePos);
      setPuzzle(newPuzzle);
      setMoveCount(prev => prev + 1);
      if (isSolved(newPuzzle)) {
        setShowSolvedPopup(true);
      }
    }
  };

  /*----------------------------- TIMER -----------------------------*/
  useEffect(() => {
    if (gameStarted) {
      const id = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setTimer(0);
      setMoveCount(0);
    }
  }, [gameStarted]);

  const formatTime = () => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      {!gameStarted ? (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to the Puzzle Game</h1>
          <div className="menu flex justify-center space-x-4 mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none" onClick={handleNewGameClick}>New Game</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out focus:outline-none" onClick={handleLeaderboardClick}>Leaderboard</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 ease-in-out focus:outline-none" onClick={handleSettingsClick}>Settings</button>
          </div>

          {showModal && (
            <div className="modal bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
              <h2 className="text-lg mb-4">Select Board Size</h2>
              <div className="flex space-x-2 mb-4">
                {[3, 4, 5, 6].map((size) => (
                  <button key={size} className="bg-gray-300 hover:bg-gray-400 
                    text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" 
                    onClick={() => selectBoardSize(size)}>
                    {size}x{size}
                  </button>
                ))}
              </div>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2
                px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="game-div w-full max-w-md p-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={handleReturnToMenu}>
            Return to Main Menu
          </button>
          <div className="timer-display">
            Time Elapsed: {formatTime()}
          </div>
          <div className="move-count">
            Moves: {moveCount}
          </div>
          <div className="game-board">
            {puzzle.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-2">
                {row.map((tile, tileIndex) => (
                  <div
                    key={tileIndex}
                    className={`border-2 border-gray-400 w-12 h-12 flex justify-center items-center m-1 ${
                      tile === 0 ? 'bg-white' : 'bg-blue-500 text-white'
                    }`}
                    onClick={() => handleTileClick(tile, rowIndex, tileIndex)}
                  >
                    {tile !== 0 ? tile : ''}
                  </div>
                ))}
              </div>
            ))}
            {showSolvedPopup && (
              <div className="solved-popup bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center">
                <p>Congratulations! You solved the puzzle.</p>
                <button onClick={() => {
                  setShowSolvedPopup(false);
                  setGameStarted(false);
                }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;