// Samruddhi Patole 
import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const [formData, setFormData] = useState({
    keyword: "",
    location: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search triggered:", formData);
  };

  return (
    <div className="foundit-clone">
      <div className="hero-center">
        <h1>Over 8,00,000 openings delivered perfectly</h1>

        <form className="search-barr" onSubmit={handleSearch}>
          <div className="input-box">
            <FaSearch className="icon" />
            <input
              type="text"
              name="keyword"
              placeholder="Search by Skills, Company or Job Title"
              value={formData.keyword}
              onChange={handleChange}
            />
          </div>

          <div className="divider"></div>

          <div className="input-box">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="divider"></div>

          <div className="input-box">
            <FaBriefcase className="icon" />
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            >
              <option value="">Experience</option>
              <option value="0-1">0-1 Years</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>

          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
        {/* ===== PROFILE REMINDER CARD ===== */}
        <div className="profile-card">
          <div className="profile-left">
            <h3>Urgent! Your profile is not visible!</h3>
            <p>Add missing information now to begin your job search</p>
          </div>
          <div className="profile-right">
            <div className="profile-score">
              <h2>95%</h2>
              <p>Proficient</p>
            </div>
            <button className="add-profile-btn">Add Profile Picture</button>
          </div>
        </div>

        {/* ===== JOBS SECTIONS ===== */}
        <section className="jobs-section">
          <h2>Jobs based on 'Applies'</h2>
          <div className="job-cards">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="job-card">
                <h4>Java Developer</h4>
                <p>Infosys Limited</p>
                <p className="job-meta">₹ 3 - 5 LPA · Pune, India</p>
                <button>Apply Now</button>
              </div>
            ))}
          </div>
        </section>

        <section className="jobs-section">
          <h2>Jobs based on 'Preference'</h2>
          <div className="job-cards">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="job-card">
                <h4>Frontend Developer</h4>
                <p>TCS Pvt Ltd</p>
                <p className="job-meta">₹ 4 - 6 LPA · Bangalore, India</p>
                <button>Apply Now</button>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FEATURED COMPANIES ===== */}
        <section className="featured-companies">
          <h2>Featured Companies</h2>
          <div className="company-logos">
            {["tcs.png", "infosys.png", "hcl.png", "zensar.png", "techmahindra.png"].map(
              (logo, i) => (
                <img key={i} src={`/${logo}`} alt="Company Logo" />
              )
            )}
          </div>
        </section>

        {/* ===== FOOTER CTA ===== */}
        <footer className="footer-section">
          <div className="footer-banner purple-banner">
            <h3>Elevate your career with industry leading Certifications.</h3>
            <p>Online certifications starting at just ₹2,644/month!</p>
          </div>

          <div className="footer-banner blue-banner">
            <h3>HCLTech</h3>
            <p>Proud to be Global Top Employer 2025</p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default HomePage;
