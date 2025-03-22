import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminScrumDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scrumTeam, setScrumTeam] = useState(null);

  useEffect(() => {
    const scrumTeams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    setScrumTeam(scrumTeams[id]);
  }, [id]);

  const handleStatusChange = (taskIndex, newStatus) => {
    const updatedTeam = { ...scrumTeam };
    updatedTeam.tasks[taskIndex].status = newStatus;

    const scrumTeams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    scrumTeams[id] = updatedTeam;
    localStorage.setItem("scrumTeams", JSON.stringify(scrumTeams));
    setScrumTeam(updatedTeam);
  };

  return (
    <div>
      <h1>Scrum Details for {scrumTeam?.name}</h1>
      <nav>
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin-profiles")}>Profiles</button>
        <button onClick={() => navigate("/login")}>Logout</button>
      </nav>

      <h2>Tasks</h2>
      <ul>
        {scrumTeam?.tasks.map((task, index) => (
          <li key={index}>
            {task.title} - {task.description} -{" "}
            <select onChange={(e) => handleStatusChange(index, e.target.value)} value={task.status}>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
      <ul>
        {scrumTeam?.users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminScrumDetails;
