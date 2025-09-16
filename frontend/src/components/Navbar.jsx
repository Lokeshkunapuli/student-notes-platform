import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { theme, toggleTheme, isLight } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">Notes</NavLink>
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Home
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Upload
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Profile
        </NavLink>
        {user?.isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Admin
          </NavLink>
        )}
        <div className="spacer" />
        
        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${isLight ? 'dark' : 'light'} mode`}>
          {isLight ? '🌙' : '☀️'} {isLight ? 'Dark' : 'Light'}
        </button>
        
        {!token ? (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Signup</NavLink>
          </>
        ) : (
          <button className="button secondary" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;