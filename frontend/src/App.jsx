import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import LeaderBoard from "./components/LeaderBoard";
import Logo from "./assets/images/puzzle.png";

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
  const [userName, setUserName] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  const [solution, setSolution] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [hints, setHints] = useState([]);
  const [remainingHints, setRemainingHints] = useState(5);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

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

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleClickOutside = (event) => {
    if (event.target.id === "overlay") {
      handleCancel();
    }
  };

  const handleLeaderboardClick = () => {
    setShowLeaderboard(true); 
  };

  const handleSettingsClick = () => { /* logic for settings */ };

  const handleReturnToMenu = () => {
    setShowLeaderboard(false);
    setGameStarted(false);
    setPuzzle([]);
    setBoardSize(null);
    setShowSolvedPopup(false);
    setSolution([]);
    setIsPuzzleSolved(false);
    setRemainingHints(5);
  };

  /*----------------------------- SELECT BOARD SIZE AND DIFFICULTY -----------------------------*/
  const selectBoardSizeAndDifficulty = async (size, difficulty) => {
    setBoardSize(size);
    setShowModal(false);
    try {
      const { data: newPuzzle } = await axios.get(`http://localhost:8084/api/v1/puzzle/new?size=${size}&difficulty=${difficulty}`);
      setPuzzle(newPuzzle);
      setTimer(0);
      setMoveCount(0);
      setGameStarted(true);
      setIsPuzzleSolved(false);
      setRemainingHints(5);
    } catch (error) {
      console.error("Error fetching new puzzle: ", error);
    }
  };

  /*----------------------------- SWAP TILES -----------------------------*/
  const handleTileClick = (tile, rowIndex, tileIndex) => {
    // If the puzzle is already solved, prevent any further moves
    if (showSolvedPopup) {
      return;
    }

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

      if (isSolved(newPuzzle) && !isPuzzleSolved) {
        setShowSolvedPopup(true);
        setIsTimerActive(false);
      }
    }
  };

  /*----------------------------- TIMER -----------------------------*/
  useEffect(() => {
    let timerId;
    if (isTimerActive) {
      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (timerId) {
      clearInterval(timerId);
    }
  
    return () => clearInterval(timerId);
  }, [isTimerActive]);

  useEffect(() => {
    if (gameStarted) {
      setIsTimerActive(true);
    }
  }, [gameStarted]);

  const formatTime = () => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  /*----------------------------- SAVE RECORD -----------------------------*/
  const saveRecord = async () => {
    try {
      await axios.post('http://localhost:8084/api/v1/users/add', {
        name: userName,
        move: moveCount,
        time: timer,
        size: boardSize
      });
      alert('Record saved successfully');
      setShowSavePopup(false);
      setGameStarted(false);
    } catch (error) {
      console.error('Error saving record: ', error);
    }
  };

  /*----------------------------- SOLVE PUZZLE -----------------------------*/
  const handleSolvePuzzle = () => {
    setShowConfirmation(true);
  };

  const confirmSolvePuzzle = async () => {
    try {
      const response = await axios.post('http://localhost:8084/api/v1/puzzle/solve', puzzle);
      setSolution(response.data);
      setIsTimerActive(false);
      setIsPuzzleSolved(true);
      setShowSolvedPopup(false); 
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error solving puzzle: ", error);
    }
  };

  /*----------------------------- REQUEST HINT -----------------------------*/
  const handleRequestHint = async () => {
    if (remainingHints > 0 && gameStarted) {
      try {
        const response = await axios.post('http://localhost:8084/api/v1/puzzle/hint', { board: puzzle, difficulty });
        // Replace the existing hints with the new hints
        setHints(response.data);
        setRemainingHints(remainingHints - 1);
      } catch (error) {
        console.error("Error fetching hints: ", error);
      }
    }
  };

  /*----------------------------- UI SECTION -----------------------------*/
  const getWidthClass = () => {
    return boardSize === 3 ? "w-1/3" : "w-1/4";
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <div className="App max-w-6xl xl:min-w-64rem min-w-0 xl:w-2/5 w-full 
        min-h-screen font-app bg-daisy flex flex-col justify-center items-center gap-10">

        {showModal && (
          <div id="overlay" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10" 
            onClick={handleClickOutside}>
            <div className="modal bg-modal shadow-lg rounded-lg px-10 pt-10 pb-10 
              mb-4 flex flex-col items-center absolute z-20 gap-5">
                <h2 className="text-5xl mb-4 font-bold">Select Board Size and Difficulty</h2>
                <div className="difficulty-select mb-4 text-3xl font-bold">
                  <label>Difficulty: </label>
                  <select className="rounded" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option className="font-bold" value="easy">Easy</option>
                    <option className="font-bold" value="medium">Medium</option>
                    <option className="font-bold" value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex space-x-3 mb-4">
                  {[3, 4, 5, 6].map((size) => (
                    <button key={size} className="bg-white hover:bg-gray-100 text-3xl
                      text-gray-800 font-bold py-2 px-6 rounded inline-flex items-center hover:scale-110" 
                      onClick={() => selectBoardSizeAndDifficulty(size, difficulty)}>
                      {size}x{size}
                    </button>
                  ))}
                </div>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2
                  px-4 rounded focus:outline-none focus:shadow-outline text-3xl" onClick={handleCancel}>
                  Cancel
                </button>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="modal bg-white p-8 rounded shadow-lg z-50">
              <h3 className="mb-4 text-lg font-bold">Are you sure?</h3>
              <p className="mb-4">Solving the puzzle will end the game.</p>
              <div className="flex justify-between">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                  onClick={confirmSolvePuzzle}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {!gameStarted && !showLeaderboard ? (
          <>
            <h1 className="font-bold text-9xl text-gray-800">Puzzly</h1>
            <img src={Logo} alt="Puzzle Logo" className="w-64 h-64 mb-5"/>
            <div className="menu flex flex-col justify-center gap-5">
              <button className="bg-blue-500 text-white px-8 py-5 rounded-xl font-bold text-5xl shadow-lg
                hover:bg-blue-600 hover:scale-110 transition duration-300 ease-in-out focus:outline-none" 
                onClick={handleNewGameClick}> 
                  New Game
              </button>
              <button className="bg-green-500 text-white px-8 py-5 rounded-xl font-bold text-5xl shadow-lg
                hover:bg-green-600 hover:scale-110 transition duration-300 ease-in-out focus:outline-none" 
                onClick={handleLeaderboardClick}>
                  Leaderboard
              </button>
              <button className="bg-teal-500 text-white px-8 py-5 rounded-xl font-bold text-5xl shadow-lg
                hover:bg-teal-600 hover:scale-110 transition duration-300 ease-in-out focus:outline-none" 
                onClick={handleSettingsClick}>
                  Settings
              </button>
            </div>
          </>
        ) : showLeaderboard ? (
          <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={handleReturnToMenu}>
              Back to Main Menu
            </button>
            <LeaderBoard />
          </>
        ) : (
          <div className="game-div w-10/12 p-4 flex justify-center items-center">
            <div className="game-board w-fit">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={handleReturnToMenu}>
                Back to Main Menu
              </button>
              <div className={`functions flex flex-row justify-between `}>
              <div className={`left flex flex-row justify-between items-center ${getWidthClass()}`}>
                  <div className="timer-display">
                    Time
                    <div className="flex justify-center items-center">
                      {formatTime()}
                    </div>
                  </div>
                  <div className="move-count">
                    Moves 
                    <div className="flex justify-center items-center">
                      {moveCount}
                    </div>
                  </div>
                </div>
                <div className={`right flex flex-row justify-between items-center ${getWidthClass()}`}>
                  <button
                    className="hint-button"
                    onClick={handleRequestHint}
                    disabled={remainingHints <= 0 || isPuzzleSolved}
                  >
                    Get Hint ({remainingHints})
                  </button>
                  <button
                    className="solve-button"
                    onClick={handleSolvePuzzle}
                    disabled={isPuzzleSolved}
                  >
                    Solve
                  </button>
                </div>
              </div>
              <div className="hint-section">
                <div className="hints">
                  {hints.map((hint, index) => (
                    <div key={index}>{hint}</div>
                  ))}
                </div>
              </div>
              {puzzle.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center mb-2">
                  {row.map((tile, tileIndex) => (
                    <div
                      key={tileIndex}
                      className={`font-number text-shadow text-5xl w-32 h-32 cursor-pointer
                        flex justify-center items-center m-1.5 rounded-2xl ${
                        tile === 0 ? 'bg-blue-500 opacity-30' : 'bg-blue-500 text-white'
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
                  <p>Time: {formatTime()}</p>
                  <p>Moves: {moveCount}</p>
                  <button onClick={() => setShowSavePopup(true)}>Save Record</button>
                  <button onClick={() => {
                    setShowSolvedPopup(false);
                    setGameStarted(false);
                  }}>Close</button>
                </div>
              )}
              {showSavePopup && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <button onClick={saveRecord}>Save</button>
                  <button onClick={() => setShowSavePopup(false)}>Cancel</button>
                </div>
              )}
              {solution.length > 0 && (
                <div className="solution">
                  <h3>Solution Steps:</h3>
                  <ul>
                    {solution.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
