import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Profiles from "./Profiles";
import ScrumDetails from "./ScrumDetails"; 
import AdminDashboard from "./AdminDashboard";
import AdminProfiles from "./AdminProfiles";
import AdminScrumDetails from "./AdminScrumDetails";
import "./styles.css";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/scrum-details/:id" element={<ScrumDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-scrum-details/:id" element={<AdminScrumDetails />} />
        <Route path="/admin-profiles" element={<AdminProfiles />} />
      </Routes>
    </Router>
  );
};

export default App;
