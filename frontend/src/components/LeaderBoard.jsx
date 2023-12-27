import React, { useState, useEffect } from "react";
import '../App.css';
import axios from "axios";

function LeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedSize, setSelectedSize] = useState(3); // Default size
    const [selectedDifficulty, setSelectedDifficulty] = useState('easy'); 

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`http://localhost:8084/api/v1/users/leaderboard?size=${selectedSize}&difficulty=${selectedDifficulty}`);
                setLeaderboardData(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard data: ", error);
            }
        };
    
        fetchLeaderboard();
    }, [selectedSize, selectedDifficulty]); 

    return (
        <div>
            <div className="board-size-tabs">
                {[3, 4, 5, 6].map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={selectedSize === size ? 'active' : ''}>
                        {size}x{size}
                    </button>
                ))}
            </div>
            {/* Difficulty selection dropdown */}
            <div className="difficulty-select">
                <label htmlFor="difficulty">Difficulty:</label>
                <select 
                    id="difficulty"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <div className="leaderboard-table">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Time (seconds)</th>
                            <th>Moves</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.time}</td>
                                <td>{user.move}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaderBoard;
