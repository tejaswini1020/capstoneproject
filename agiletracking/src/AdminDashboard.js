import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [scrumTeams, setScrumTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [newScrum, setNewScrum] = useState({
    scrumName: "",
    taskTitle: "",
    taskDescription: "",
    taskStatus: "To Do",
    assignedTo: "",
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser || loggedInUser.role !== "Admin") {
      navigate("/login");
      return;
    }

    const storedScrumTeams = JSON.parse(localStorage.getItem("scrumTeams")) || [];
    setScrumTeams(storedScrumTeams);
  }, [navigate]);

  const handleInputChange = (e) => {
    setNewScrum({ ...newScrum, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateScrum = () => {
    if (!newScrum.scrumName || !newScrum.taskTitle || !newScrum.taskDescription || !newScrum.assignedTo) {
      alert("All fields are required!");
      return;
    }

    let updatedScrums = [...scrumTeams];

    if (editingIndex !== null) {
      // Update existing scrum
      updatedScrums[editingIndex] = {
        name: newScrum.scrumName,
        tasks: [
          {
            title: newScrum.taskTitle,
            description: newScrum.taskDescription,
            status: newScrum.taskStatus,
            assignedTo: newScrum.assignedTo,
          },
        ],
        users: [{ name: newScrum.assignedTo, email: newScrum.assignedTo }],
      };
    } else {
      // Add new scrum
      updatedScrums.push({
        name: newScrum.scrumName,
        tasks: [
          {
            title: newScrum.taskTitle,
            description: newScrum.taskDescription,
            status: newScrum.taskStatus,
            assignedTo: newScrum.assignedTo,
          },
        ],
        users: [{ name: newScrum.assignedTo, email: newScrum.assignedTo }],
      });
    }

    localStorage.setItem("scrumTeams", JSON.stringify(updatedScrums));
    setScrumTeams(updatedScrums);
    setShowForm(false);
    setEditingIndex(null);
    setNewScrum({ scrumName: "", taskTitle: "", taskDescription: "", taskStatus: "To Do", assignedTo: "" });
  };

  const handleEditScrum = (index) => {
    const scrum = scrumTeams[index];
    setNewScrum({
      scrumName: scrum.name,
      taskTitle: scrum.tasks[0].title,
      taskDescription: scrum.tasks[0].description,
      taskStatus: scrum.tasks[0].status,
      assignedTo: scrum.tasks[0].assignedTo,
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteScrum = (index) => {
    if (window.confirm("Are you sure you want to delete this scrum?")) {
      const updatedScrums = scrumTeams.filter((_, i) => i !== index);
      localStorage.setItem("scrumTeams", JSON.stringify(updatedScrums));
      setScrumTeams(updatedScrums);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <button onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/admin-profiles")}>Profiles</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <button onClick={() => setShowForm(true)}>Add New Scrum</button>

      {showForm && (
        <div>
          <h2>{editingIndex !== null ? "Edit Scrum" : "Add New Scrum"}</h2>
          <input type="text" name="scrumName" placeholder="Scrum Name" value={newScrum.scrumName} onChange={handleInputChange} />
          <input type="text" name="taskTitle" placeholder="Task Title" value={newScrum.taskTitle} onChange={handleInputChange} />
          <input type="text" name="taskDescription" placeholder="Task Description" value={newScrum.taskDescription} onChange={handleInputChange} />
          <select name="taskStatus" value={newScrum.taskStatus} onChange={handleInputChange}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <input type="email" name="assignedTo" placeholder="Assign To (User Email)" value={newScrum.assignedTo} onChange={handleInputChange} />
          <button onClick={handleAddOrUpdateScrum}>{editingIndex !== null ? "Update Scrum" : "Create Scrum"}</button>
          <button onClick={() => { setShowForm(false); setEditingIndex(null); }}>Cancel</button>
        </div>
      )}

      <h2>Scrum Teams</h2>
      <ul>
        {scrumTeams.map((team, index) => (
          <li key={index}>
            {team.name}
            <button onClick={() => navigate(`/admin-scrum-details/${index}`)}>Get Details</button>
            <button onClick={() => handleEditScrum(index)}>Edit</button>
            <button onClick={() => handleDeleteScrum(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
