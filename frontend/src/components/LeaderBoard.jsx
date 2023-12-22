import React, { useState, useEffect } from "react";
import '../App.css';
import axios from "axios";

function LeaderBoard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedSize, setSelectedSize] = useState(3); // Default size

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`http://localhost:8084/api/v1/users/leaderboard?size=${selectedSize}`);
                setLeaderboardData(response.data);
            } catch (error) {
                console.error("Error fetching leaderboard data: ", error);
            }
        };

        fetchLeaderboard();
    }, [selectedSize]);

    return (
        <div>
            <div className="board-size-tabs">
                {[3, 4, 5, 6].map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}>{size}x{size}</button>
                ))}
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
