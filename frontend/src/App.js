import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";

function App() {
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

  const selectBoardSize = (size) => {
    setBoardSize(size);
    setShowModal(false);
    // Start game with selected board size
  };

  const handleLeaderboardClick = () => {
    // Logic for showing the leaderboard
  };

  const handleSettingsClick = () => {
    // Logic for showing settings
  };

  return (
    <div className="App">
      <h1>Welcome to the Puzzle Game</h1>
      <div className="menu">
        <button onClick={handleNewGameClick}>New Game</button>
        <button onClick={handleLeaderboardClick}>Leaderboard</button>
        <button onClick={handleSettingsClick}>Settings</button>
      </div>

      {showModal && (
        <div className="modal">
          <h2>Select Board Size</h2>
          {[3, 4, 5, 6].map((size) => (
            <button key={size} onClick={() => selectBoardSize(size)}>
              {size}x{size}
            </button>
          ))}
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
