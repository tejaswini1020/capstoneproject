import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ScrumDetails = () => {
  const { id } = useParams(); // Get scrum team ID from URL
  const navigate = useNavigate();
  const [scrumTeam, setScrumTeam] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get logged-in user from local storage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    setUser(loggedInUser);

    // Fetch scrum team details from local storage
    const teams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    const selectedTeam = teams.find((team) => team.id === parseInt(id));

    if (!selectedTeam) {
      navigate("/dashboard"); // Redirect if team not found
      return;
    }

    setScrumTeam(selectedTeam);
  }, [id, navigate]);

  const assignTaskToUser = (task, userEmail) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let updatedUsers = users.map((user) => {
      if (user.email === userEmail) {
        user.tasks = user.tasks || []; // Ensure user has a tasks array
        user.tasks.push(task); // Add task to user's history
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAssignTask = (task, userEmail) => {
    // Update user's task history
    assignTaskToUser(task, userEmail);

    // Update Scrum Team data in localStorage
    let teams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    let updatedTeams = teams.map((team) => {
      if (team.id === parseInt(id)) {
        team.tasks = team.tasks.map((t) => {
          if (t.title === task.title) {
            return { ...t, assignedTo: userEmail };
          }
          return t;
        });
      }
      return team;
    });

    localStorage.setItem("scrumTeams", JSON.stringify(updatedTeams));
    setScrumTeam((prev) => ({
      ...prev,
      tasks: updatedTeams.find((t) => t.id === parseInt(id))?.tasks || [],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div>
      <h1>Scrum Details for {scrumTeam?.name}</h1>
      <nav>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/profiles")}>Profiles</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {scrumTeam ? (
        <div>
          <h2>Tasks</h2>
          <ul>
            {scrumTeam.tasks.length > 0 ? (
              scrumTeam.tasks.map((task, index) => (
                <li key={index}>
                  <strong>{task.title}</strong> - {task.description} -{" "}
                  <em>{task.status}</em> - Assigned To:{" "}
                  {task.assignedTo ? task.assignedTo : "Not Assigned"}
                </li>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </ul>

          <h2>Users</h2>
          <ul>
            {scrumTeam.users.length > 0 ? (
              scrumTeam.users.map((member, index) => (
                <li key={index}>
                  {member.name} - {member.email}{" "}
                  <button onClick={() => handleAssignTask(scrumTeam.tasks[0], member.email)}>
                    Assign First Task
                  </button>
                </li>
              ))
            ) : (
              <p>No users in this team</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading Scrum Details...</p>
      )}
    </div>
  );
};

export default ScrumDetails;
