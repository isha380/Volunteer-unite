import React from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = ({ user }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" className="nav-logo" />
        <div className="nav-title">
          <h3>Volunteer Unite</h3>
          <p>Making a difference together</p>
        </div>
      </div>

      <div className="nav-right">
        <button className="nav-btn">Browse Events</button>
        <button className="nav-btn">Dashboard</button>

        <div className="profile">
          <div className="profile-icon">{user?.name?.charAt(0) || "U"}</div>
          <div className="dropdown">
            <p>{user?.email}</p>
            <button>Edit Profile</button>
            <button>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
