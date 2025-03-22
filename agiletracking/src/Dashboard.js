import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [scrumTeams, setScrumTeams] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get logged-in user from local storage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    setUser(loggedInUser);

    // Fetch all scrum teams from local storage
    const teams = JSON.parse(localStorage.getItem("scrumTeams")) || [];

    // Filter teams where the logged-in user is assigned
    const assignedTeams = teams.filter((team) =>
      team.users.some((u) => u.email === loggedInUser.email)
    );

    setScrumTeams(assignedTeams);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser"); // Clear session
    navigate("/login");
  };

  return (
    <div>
      <h1>Scrum Teams</h1>
      <nav>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/profiles")}>Profiles</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <ul>
        {scrumTeams.length > 0 ? (
          scrumTeams.map((team, index) => (
            <li key={index}>
              {team.name}{" "}
              <button onClick={() => navigate(`/scrum-details/${team.id}`)}>
                Get Details
              </button>
            </li>
          ))
        ) : (
          <p>No Scrum Teams Assigned to You</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
