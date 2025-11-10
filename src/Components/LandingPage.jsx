import rgLogo from "../assets/rgLogo.png";
import "./LandingPage.css"

import tcs from "../assets/tcs.png";
import zensar from "../assets/zensar.png";
import infosys from "../assets/infosys.png";
import capgemini from "../assets/capgemini.png";
import ltimindtree from "../assets/ltimindtree.png";
import valuelabs from "../assets/valuelabs.png";
import quess from "../assets/quess.png";
import taggd from "../assets/taggd.png";
import { Slider } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDownload, FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaTwitter, FaYoutube } from "react-icons/fa";
import Typed from "typed.js";

function LandingPage() {

  const navigate = useNavigate();
  const logos = [
    tcs,
    zensar,
    ltimindtree,
    valuelabs,
    infosys,
    capgemini,
    quess,
    taggd,
  ];

  const [activeTab, setActiveTab] = useState("Skills");

  const tabs = ["Skills", "Location", "Industry", "Functions", "Roles", "Company"];

  const data = {
    Skills: ["Python", "SQL", "Java", "AWS", "JavaScript", "Excel", "Git", "Azure", "Docker", "Kubernetes", "Sales", "Data Analysis", "Ms Office", "Lead Generation", "HTML", "Power BI", "GCP", "CSS", "Project Management", "Jenkins"],
    Location: ["Pune", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Delhi", "Noida", "Kolkata"],
    Industry: ["IT Services", "Banking", "Healthcare", "Education", "Finance", "E-commerce", "Manufacturing"],
    Functions: ["Development", "Testing", "DevOps", "Sales", "Support", "Marketing"],
    Roles: ["Software Engineer", "Team Lead", "Project Manager", "HR Executive", "Recruiter"],
    Company: ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Capgemini"]
  };

  const handlePostJobClick = () => {
    navigate("/loginemp"); // redirect to employer login page
  };

  useEffect(() => {
    const typed = new Typed("#typed", {
      strings: [
        "Find Your Dream Job",
        "Hire the Best Talent",
        "Connecting People",
        "Building Careers"
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1000,
      loop: true,
      smartBackspace: true
    });

    return () => typed.destroy();
  }, []);


  return (
    <div>

      <section className="hero">
        <div className="particles"></div>

        <div className="hero-content">
          <h2 className="static-line wave-text">Connecting Talent with Opportunity.</h2>

          <h1 className="typing-line">
            <span id="typed" className="wave-text"></span>
          </h1>
        </div>
      </section>


      <div>
        <img src={rgLogo} alt="" className="logo" />
      </div>

      <div className="marquee-container">
        <h2 className="marquee-title">Featured Companies</h2>
        <div className="marquee">
          <div className="marquee-track">
            {logos.concat(logos).map((logo, index) => (
              <div key={index} className="marquee-item">
                <img src={logo} alt="Company logo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="job-tabs-container">
        <h2>Find job vacancies by</h2>
        <div className="tab-header">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {data[activeTab].map((item, i) => (
            <span
              key={i}
              className="chip"
              onClick={() => navigate("/login")}
            >
              {item}
            </span>
          ))}
        </div>


        <div className="view-all">
          <a onClick={() => navigate("/login")}>View all jobs by {activeTab} →</a>
        </div>
      </div>

      <section className="employer-banner">
        <div className="employer-banner-content">
          <div className="employer-banner-image">
            <img
              src={rgLogo} // replace with your own image path
              alt="Employers"
            />
          </div>

          <div onClick={handlePostJobClick} className="employer-banner-text">
            <div className="tag">RG FOR EMPLOYERS</div>
            <h2 style={{ color: "#b2520e" }}>Want to hire?</h2>
            <p>
              Find the best candidate from <strong>5 crore+</strong> active job seekers!
            </p>
            <button className="post-job-btn" onClick={handlePostJobClick}>
              Post job <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          {/* Left Section */}
          <div className="footer-left">
            <div className="footer-column">
              <h4>Job Categories</h4>
            </div>
            <div className="footer-column">
              <h4>Employers</h4>
            </div>
            <div className="footer-column">
              <h4>Job Seekers</h4>
            </div>
            <div className="footer-column">
              <h4>Career Advice</h4>
            </div>
            <div className="footer-column">
              <h4>Company Info</h4>
            </div>
            <div className="footer-column">
              <h4>IT Jobs</h4>
            </div>
            <div className="footer-column">
              <h4>Non IT Jobs</h4>
            </div>
            <div className="footer-column">
              <h4>Partnerships</h4>
            </div>
          </div>

          {/* Right Section */}
          <div className="footer-right">
            <div className="footer-country">
              <label
                // style={{color:"black"}}
                htmlFor="country">Selected Country</label>
              <select id="country">
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
              </select>
            </div>

            <p><FaPhone /> Toll No: +91 97 6321 2868 | Toll Free: 1800-419-6666</p>
            <p><FaEnvelope /> 157ipl@gmail.com</p>

            {/* <div className="footer-download">
              <FaDownload /> Download The App
              <div className="app-buttons">
                <img src="/apple.png" alt="App Store" />
                <img src="/googleplay.png" alt="Google Play" />
              </div>
            </div> */}

            <div className="footer-social">
              <span>Stay Connected</span>
              <div className="social-icons">
                <FaFacebook />
                <FaTwitter />
                <FaLinkedin />
                <FaInstagram />
                <FaYoutube />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>
            | Security & Fraud | Privacy Notice | Terms of Use | Beware of Fraudsters | Be Safe | Complaints |
          </p>
          <p>© 2025 RG Portal | All Rights Reserved</p>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
