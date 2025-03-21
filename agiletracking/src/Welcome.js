import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [scrumTeams, setScrumTeams] = useState([]);

  useEffect(() => {
    // Load scrum teams from local storage
    const teams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    setScrumTeams(teams);
  }, []);

  return (
    <div className="container">
      <h1>Scrum Teams</h1>
      <h2>Welcome to Agile Tracking System</h2>
      <nav>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </nav>
      <ul>
        {scrumTeams.map((team, index) => (
          <li key={index}>
            {team.name} 
            <button onClick={() => navigate("/login")}>Get Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Welcome;
