import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfiles = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [scrumTeams, setScrumTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUserTasks, setSelectedUserTasks] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Employee" });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
    const storedScrumTeams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    setScrumTeams(storedScrumTeams);
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email.includes("@") || !newUser.password) {
      alert("All fields are required, and email must contain '@'!");
      return;
    }

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowForm(false);
    setNewUser({ name: "", email: "", password: "", role: "Employee" });
  };

  const handleViewUserTasks = (userEmail) => {
    const storedScrumTeams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
  
    // Get tasks assigned to user from scrum teams
    const scrumTeamTasks = storedScrumTeams.flatMap((team) =>
      team.tasks
        .filter((task) => task.assignedTo === userEmail)
        .map((task) => ({
          title: task.title,
          description: task.description,
          status: task.status,
          teamName: team.name, // Add team name for better clarity
        }))
    );
  
    setSelectedUserTasks({ email: userEmail, tasks: scrumTeamTasks });
  };
  
  
  return (
    <div>
      <h1>Admin Profiles</h1>
      <nav>
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin-profiles")}>Profiles</button>
        <button onClick={() => navigate("/login")}>Logout</button>
      </nav>

      <button onClick={() => setShowForm(true)}>Add New User</button>

      {showForm && (
        <div>
          <h2>Add New User</h2>
          <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
          <select name="role" onChange={handleInputChange}>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
          <button onClick={handleAddUser}>Create User</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <h2>Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.email} ({user.role})  
            <button onClick={() => handleViewUserTasks(user.email)}>Get History</button>
          </li>
        ))}
      </ul>

      {selectedUserTasks && (
        <div>
          <h2>Tasks Worked By {selectedUserTasks.email}</h2>
          {selectedUserTasks.tasks.length > 0 ? (
            <ul>
              {selectedUserTasks.tasks.map((task) => (
                <li key={task.id}>
                  {task.title} - {task.description} - <strong>{task.status}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks assigned.</p>
          )}
          <button onClick={() => setSelectedUserTasks(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AdminProfiles;
