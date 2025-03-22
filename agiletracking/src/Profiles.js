import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profiles = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login"); 
      return;
    }
    setUser(loggedInUser);

    
    const scrumTeams = JSON.parse(localStorage.getItem("scrumTeams")) || [];

    let tasks = [];
    scrumTeams.forEach((team) => {
      team.tasks.forEach((task) => {
        if (task.assignedTo === loggedInUser.email) {
          tasks.push(task);
        }
      });
    });

    setUserTasks(tasks);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div>
      <h1>User Profile</h1>
      <nav>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/profiles")}>Profiles</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {user && (
        <div>
          <h2>Tasks Worked By {user.name}</h2>
          {userTasks.length > 0 ? (
            <ul>
              {userTasks.map((task, index) => (
                <li key={index}>
                  <strong>{task.title}</strong> - {task.description} -{" "}
                  <em>{task.status}</em>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks assigned</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profiles;
