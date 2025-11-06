import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserTypeSelection.css";

const UserTypeSelection = () => {
  const navigate = useNavigate();


  return (
    <div className="landing-container">
      {/* {showHeader && (
        <header className="modern-header clean">
          <div className="header-left">
            <span className="logo-accent">RG</span> Portal
          </div>
          <div className="header-right">
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </div>
        </header>
      )} */}

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="floating-bg">
          <span className="blob"></span>
          <span className="blob delay"></span>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Welcome to RG Portal</h1>
          <p className="hero-subtitle">
            A unified space for Employees and Candidates — manage, connect, and
            grow together.
          </p>
        </div>

        {/* --- ROLE CARDS --- */}
        <div className="role-cards">
          <div className="role-card" onClick={() => navigate("/loginemp")}>
            {/* <img src="/employee.svg" alt="Employee" className="role-icon" /> */}
            <h2>Employee</h2>
            <p>Access tools, manage hiring, and collaborate with your team.</p>
          </div>

          <div className="role-card" onClick={() => navigate("/login")}>
            {/* <img src="/candidate.svg" alt="Candidate" className="role-icon" /> */}
            <h2>Candidate</h2>
            <p>Apply for jobs, track applications, and connect with recruiters.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserTypeSelection;
