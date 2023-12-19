import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";

function App() {
  // Test conenction
  const [sampleJson, setSampleJson] = useState([]);

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

  const [showModal, setShowModal] = useState(false);
  const [boardSize, setBoardSize] = useState(null);

  const handleNewGameClick = () => {
    setShowModal(true);
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [puzzle, setPuzzle] = useState([]);

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

  const handleLeaderboardClick = () => {
    // Logic for showing the leaderboard
  };

  const handleSettingsClick = () => {
    // Logic for showing settings
  };

  const handleReturnToMenu = () => {
    setGameStarted(false);
    setPuzzle([]);
    setBoardSize(null);
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
          <div className="game-board">
            {puzzle.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-2">
                {row.map((tile, tileIndex) => (
                  <div
                    key={tileIndex}
                    className={`border-2 border-gray-400 w-12 h-12 flex justify-center items-center m-1 ${
                      tile === 0 ? 'bg-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {tile !== 0 ? tile : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
