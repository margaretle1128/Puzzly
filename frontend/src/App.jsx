import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import LeaderBoard from "./components/LeaderBoard";
import Logo from "./assets/images/puzzle.png";
import swal from 'sweetalert';

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
    setHints([]); 
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
      setHints([]); 
    } catch (error) {
      console.error("Error fetching new puzzle: ", error);
    }
  };

  /*----------------------------- SWAP TILES -----------------------------*/
  const handleTileClick = (tile, rowIndex, tileIndex) => {
    // If the puzzle is already solved, prevent any further moves
    if (showSolvedPopup || tile === 0) {
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
  
    const emptyTilePos = findEmptyTile(puzzle);
    if (isValidMove({ row: rowIndex, column: tileIndex }, emptyTilePos)) {
      // Calculate the translation distance based on your tile size
      const translateDistance = "100%"; // Adjust based on your tile size
  
      // Determine the direction and set the translation style
      let translationStyle = {};
      if (rowIndex > emptyTilePos.r) { // Tile moves up
        translationStyle = { transform: `translateY(-${translateDistance})` };
      } else if (rowIndex < emptyTilePos.r) { // Tile moves down
        translationStyle = { transform: `translateY(${translateDistance})` };
      } else if (tileIndex > emptyTilePos.c) { // Tile moves left
        translationStyle = { transform: `translateX(-${translateDistance})` };
      } else if (tileIndex < emptyTilePos.c) { // Tile moves right
        translationStyle = { transform: `translateX(${translateDistance})` };
      }
  
      // Apply the style to the tile 
      const newPuzzle = puzzle.map((row, rIndex) => 
        row.map((cell, cIndex) => {
          if (rIndex === rowIndex && cIndex === tileIndex) {
            return { value: cell, style: translationStyle };
          }
          return cell;
        })
      );
  
      setPuzzle(newPuzzle);
  
      setTimeout(() => {
        finalizeTileMove(rowIndex, tileIndex, emptyTilePos);
      }, 300); // Duration should match your CSS transition
    }
  };
  
  const finalizeTileMove = (rowIndex, tileIndex, emptyTilePos) => {
    // Swap the clicked tile with the empty space
    const swapTiles = (puzzle, fromPos, toPos) => {
      const newPuzzle = puzzle.map(row => [...row]);
      newPuzzle[toPos.r][toPos.c] = puzzle[fromPos.row][fromPos.column];
      newPuzzle[fromPos.row][fromPos.column] = 0;
      return newPuzzle;
    };
  
    const newPuzzle = swapTiles(puzzle, { row: rowIndex, column: tileIndex }, emptyTilePos);
    const resetStylesPuzzle = newPuzzle.map(row =>
      row.map(cell => {
        if (typeof cell === 'object' && cell.style) {
          return cell.value;
        }
        return cell;
      })
    );
  
    setPuzzle(resetStylesPuzzle);
  
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
  
    if (isSolved(resetStylesPuzzle)) {
      setShowSolvedPopup(true);
      setIsTimerActive(false);
      setIsPuzzleSolved(true);
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
        size: boardSize,
        difficulty: difficulty
      });
      swal("Success!", "Your record has been saved.", "success");
      setShowSavePopup(false);
      setGameStarted(false);
    } catch (error) {
      swal("Oops!", "There was an error saving your record.", "error");
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
      setHints([]);
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
  const getWidthClassRight = () => {
    if (boardSize === 3) {
      return "w-10/12";
    } else if (boardSize === 4) {
      return "w-3/5";
    } else if (boardSize === 5){
      return "w-2/4";
    } else {
      return "w-2/5";
    }
  };  

  /*----------------------------- MAP DIRECTION -----------------------------*/
  const mapDirection = (steps) => {
    const directionMap = {
      'L': 'Left',
      'R': 'Right',
      'U': 'Up',
      'D': 'Down'
    };
    
    return steps.split(' ').map(step => {
      if (!isNaN(step)) {
        return step;
      }
      return directionMap[step] || step;
    }).join(' '); 
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <h1 className="font-bold text-8xl text-gray-800">Puzzly</h1>
            <img src={Logo} alt="Puzzle Logo" className="w-52 h-52 mb-5"/>
            <div className="menu flex flex-col justify-center gap-5">
              <button className="bg-blue-500 text-white px-8 py-5 rounded-xl font-bold text-4xl shadow-lg text-shadow
                hover:bg-blue-600 hover:scale-110 transition duration-300 ease-in-out focus:outline-none" 
                onClick={handleNewGameClick}> 
                  New Game
              </button>
              <button className="bg-green-500 text-white px-8 py-5 rounded-xl font-bold text-4xl shadow-lg text-shadow
                hover:bg-green-600 hover:scale-110 transition duration-300 ease-in-out focus:outline-none" 
                onClick={handleLeaderboardClick}>
                  Leaderboard
              </button>
              <button className="bg-teal-500 text-white px-8 py-5 rounded-xl font-bold text-4xl shadow-lg text-shadow
                hover:bg-teal-600 hover:scale-110 transition duration-300 ease-in-out focus:outline-none" 
                onClick={handleSettingsClick}>
                  Settings
              </button>
            </div>
          </>
        ) : showLeaderboard ? (
          <div className="w-10/12 pt-1.5 flex flex-col justify-center items-center">
            <div className="leaderboard w-fit h-5/6 relative">
              <button className="absolute top-0 left-0 text-black font-semibold text-7xl font-mono hover:scale-110" onClick={handleReturnToMenu}>
                &lt;
              </button>
              <h1 className="text-6xl font-semibold flex justify-center items-center pt-3">Leaderboard</h1>
              <LeaderBoard />
            </div>
          </div>
        ) : (
          <div className="game-div w-10/12 pt-1.5 flex justify-center items-center">
            <div className="game-board w-fit h-5/6">
              <div className="flex flex-row justify-between h-24 mb-3">
                <button className="text-white flex flex-start font-semibold text-7xl font-mono hover:scale-110" onClick={handleReturnToMenu}>
                  &lt;
                </button>
                <div className={`functions flex flex-row justify-end pb-5 w-full`}>
                  <div className={`right rounded-2xl bg-yellow-500 h-24 p-4 text-white text-2xl flex flex-row justify-between items-center ${getWidthClassRight()}`}>
                    <div className="timer-display text-shadow font-bold text-xl flex flex-col justify-center items-end">
                      Time
                      <div className="flex font-timer text-3xl justify-center items-center">
                        {formatTime()}
                      </div>
                    </div>
                    <div className="move-count font-bold text-shadow flex text-xl flex-col justify-center items-end">
                      Moves 
                      <div className="flex font-timer text-3xl justify-center items-center">
                        {moveCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {puzzle.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center mb-2">
                  {row.map((tile, tileIndex) => {
                    // Extract the value and style if tile is an object, otherwise assume it's just the value
                    const tileValue = tile.value !== undefined ? tile.value : tile;
                    const tileStyle = tile.style !== undefined ? tile.style : {};

                    return (
                      <div
                        key={tileIndex}
                        className={`font-number text-shadow text-3xl w-24 h-24 cursor-pointer
                          flex justify-center items-center m-1 rounded-2xl transition-transform duration-300 ${
                          tileValue === 0 ? 'bg-blue-500 opacity-30 relative z-0' : 'bg-blue-500 text-white'
                        }`}
                        style={tileStyle}
                        onClick={() => handleTileClick(tileValue, rowIndex, tileIndex)}
                      >
                        {tileValue !== 0 ? tileValue : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className={`rounded-2xl p-1 text-white text-2xl flex flex-row justify-between items-center w-full gap-4`}>
                <button
                  className="hint-button text-shadow font-bold text-2xl w-1/2 bg-green-500 py-4 rounded-xl
                  hover:scale-110 transition duration-300 ease-in-out focus:outline-none shadow-lg"
                  onClick={handleRequestHint}
                  disabled={remainingHints <= 0 || isPuzzleSolved}
                >
                  Hint ({remainingHints} left)
                </button>
                <button
                    className="solve-button text-shadow font-bold text-2xl w-1/2 bg-green-500 py-4 rounded-xl
                    hover:scale-110 transition duration-300 ease-in-out focus:outline-none shadow-lg"
                    onClick={handleSolvePuzzle}
                    disabled={isPuzzleSolved}
                  >
                    Solve
                </button>
              </div>
              <div className="w-full p-1 py-3">
                {solution.length > 0 && (
                  <div className="solution-container bg-white rounded-xl p-4 text-2xl max-h-96">
                    <div className="solution max-h-80 overflow-auto scrollbar-w-2 scrollbar-track-gray-200 scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                      <h3 className="font-bold">Solution Steps:</h3>
                      <ul>
                        {solution.map((step, index) => (
                          <li key={index}>{mapDirection(step)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {hints.length > 0 && (
                  <div className="hint-section bg-white rounded-xl p-4">
                    <div className="hints text-2xl">
                      <h3 className="font-bold">Hint:</h3>
                      {hints.map((hint, index) => (
                        <div key={index}>{mapDirection(hint)}</div>
                      ))}
                    </div>
                  </div>
                  )}
              </div>
              {showSolvedPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                  <div className="solved-popup bg-white shadow-lg rounded-lg text-2xl px-8 pt-6 pb-8 mb-4 flex flex-col items-center z-50">
                    <p className="text-4xl font-semibold mb-4">Congratulations! You solved the puzzle.</p>
                    <p className="mb-2">Time: {formatTime()}</p>
                    <p className="mb-4">Moves: {moveCount}</p>
                    <button 
                      className="bg-blue-500 text-white font-bold px-6 py-2 rounded-md shadow-lg text-shadow
                      hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none"
                      onClick={() => setShowSavePopup(true)}
                    >
                      Save Record
                    </button>
                    <button 
                      className="mt-4 bg-gray-500 text-white font-bold px-6 py-2 rounded-md shadow-lg text-shadow
                      hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none"
                      onClick={() => {
                        setShowSolvedPopup(false);
                        setGameStarted(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              {showSavePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                  <div className="bg-white text-2xl shadow-lg rounded-lg p-6 mb-4 flex flex-col items-center z-50">
                    <h3 className="text-4xl font-semibold mb-4">Enter your name to save the record</h3>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-center p-2 mb-4 border rounded"
                    />
                    <div className="flex gap-4">
                      <button
                        className="bg-blue-500 font-bold text-white px-6 py-2 rounded-md shadow-lg text-shadow
                        hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none"
                        onClick={saveRecord}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 font-bold text-white px-6 py-2 rounded-md shadow-lg text-shadow
                        hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none"
                        onClick={() => setShowSavePopup(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
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
