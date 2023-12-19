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

  return (
    <div className="App">
      <h1>Hello world!</h1>
      <div>
        Sample Users:
        <ul>
          {sampleJson.map((user, index) => (
            <li key={index}>
              {user.name}, Moves: {user.move}, Time: {user.time}, Size: {user.size}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
