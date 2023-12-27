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
        <div className="p-6 bg-white rounded shadow-lg w-full mt-5 h-44rem">
            <div className="wrapper h-full">
                <div className="flex justify-between mb-4 gap-14">
                    <div className="board-size-tabs flex justify-between gap-2">
                        {[3, 4, 5, 6].map(size => (
                            <button 
                                key={size} 
                                onClick={() => setSelectedSize(size)} 
                                className={`py-1 px-5 text-3xl font-bold rounded hover:text-shadow focus:outline-none hover:bg-modal hover:text-white ${selectedSize === size ? 'bg-modal text-shadow text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {size}x{size}
                            </button>
                        ))}
                    </div>
                    <div className="difficulty-select text-3xl font-bold">
                        <label htmlFor="difficulty" className="mr-2 text-black">Difficulty:</label>
                        <select 
                            id="difficulty"
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="p-1 bg-white border rounded shadow focus:outline-none"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>
                <div className="leaderboard-table text-2xl h-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 border-b-2">Rank</th>
                                <th className="p-2 border-b-2">Name</th>
                                <th className="p-2 border-b-2">Time (seconds)</th>
                                <th className="p-2 border-b-2">Moves</th>
                            </tr>
                        </thead>
                    </table>

                    <div className="overflow-auto h-5/6">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {leaderboardData.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="p-2 border-b">{index + 1}</td>
                                        <td className="p-2 border-b">{user.name}</td>
                                        <td className="p-2 border-b">{user.time}</td>
                                        <td className="p-2 border-b">{user.move}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaderBoard;
