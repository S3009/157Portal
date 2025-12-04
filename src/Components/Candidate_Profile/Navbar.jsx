// Samruddhi Patole 29/10/25

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUsers,
  FaEnvelope,
  FaHome,
  FaBriefcase,
} from "react-icons/fa";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import ChatBot from "./ChatBot";
import { useUser } from "../UserContext";
import { API_BASE_PORTAL } from "../../API/api";
import ProfilePage from "./Profile/ProfilePage";
const Navbar = () => {

  // ===== Navbar States =====
  const { user } = useUser(); // get user here
  console.log("USER FROM CONTEXT = ", user);

  const { logoutUser } = useUser(); // ✅ now it's defined
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const jobsRef = useRef(null);
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  { activeSection === "profile" && <ProfilePage /> }

  const [showDropdown, setShowDropdown] = useState();
  const [showInterviewSubmenu, setShowInterviewSubmenu] = useState();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchSkill, setSearchSkill] = useState("");
  const [searchExp, setSearchExp] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // ===== Job Dashboard States =====
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "All Locations",
    experience: "All Experience Levels",
    salary: "All Salary Ranges",
  });
  const [selectedJD, setSelectedJD] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const companyDropdownRef = useRef(null);

  // ===== Chat Popup States =====
  // const [showChatPopup, setShowChatPopup] = useState(false);
  // // const [messages, setMessages] = useState([
  //   { sender: "recruiter", text: "Hi Samruddhi! We have a great job for you!" },
  //   { sender: "candidate", text: "Hello! I’m interested, please tell me more." },
  // ]);
  const [companyNames, setCompanyNames] = useState([]);
  const [showCompanies, setShowCompanies] = useState(false);

  // const [newMessage, setNewMessage] = useState("");
  // ===== Optional Test States =====
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [answers, setAnswers] = useState({});
  const [appliedRole, setAppliedRole] = useState("");

  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState(
    JSON.parse(localStorage.getItem("savedJobs")) || []
  );
  const toggleSave = async (jobId) => {
    const candidateId = 1;

    try {
      let updated;
      if (savedJobs.includes(jobId)) {
        await axios.delete(
          `http://localhost:8080/api/jobportal/unsave?candidateId=${candidateId}&requirementId=${jobId}`
        );
        updated = savedJobs.filter((id) => id !== jobId);
      } else {
        await axios.post(
          `http://localhost:8080/api/jobportal/save?candidateId=${candidateId}&requirementId=${jobId}`
        );
        updated = [...savedJobs, jobId];
      }

      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setSavedJobs(updated);
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to update saved job status.");
    }
  };
  // ===== Notification Panel =====
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New job posted at TCS for Frontend Developer", time: "2h ago" },
    { id: 2, message: "Your application at Infosys was viewed by recruiter", time: "5h ago" },
    { id: 3, message: "Wipro HR shortlisted your profile for next round", time: "1d ago" },
  ]);


  // ===== Handle click outside =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openPanel === "jobs" &&
        jobsRef.current &&
        !jobsRef.current.contains(event.target)
      ) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPanel]);

  const togglePanel = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  // ===== Fetch jobs =====
useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);

      // 🟦 1. Fetch Portal Jobs (existing)
      const portalRes = await axios.get(`http://localhost:8080/api/jobportal/getAllRequirements`);
      const portalJobs = portalRes.data || [];

      // 🟩 2. Fetch Recruiter Jobs (new)
      const recruiterRes = await axios.get(
        "https://rg.157careers.in/api/ats/157industries/fetch-all-job-descriptions/139/Recruiters"
      );
      const recruiterJobs = recruiterRes.data || [];

      // Normalize recruiter job object keys to match candidate portal fields
      const formattedRecruiterJobs = recruiterJobs.map((job) => ({
        requirementId: job.requirementId,
        companyName: job.companyName,
        location: job.location,
        experience: job.experience,
        jobRole: job.designation,
        salary: job.salary,
        qualification: job.qualification || "Not Mentioned",
        companyLogo: job.companyLogo || "",
        skills: job.skills || "",
      }));

      // 🟧 3. Merge both sources
      const mergedJobs = [...portalJobs, ...formattedRecruiterJobs];

      setJobs(mergedJobs);
      setFilteredJobs(mergedJobs);

      // Save to local storage
      localStorage.setItem("jobsList", JSON.stringify(mergedJobs));

    } catch (error) {
      console.error("❌ Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);



  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${API_BASE_PORTAL}/companies`);
        setCompanyNames(res.data || []);
      } catch (error) {
        console.error("Error fetching company names:", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target)
      ) {
        setShowCompanies(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const fetchSavedJobs = async () => {
      const candidateId = 1;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/jobportal/getSavedJobsByCandidate/${candidateId}`
        );

        const savedIds = res.data.map(job => job.requirementId);

        setSavedJobs(savedIds);
        localStorage.setItem("savedJobs", JSON.stringify(savedIds));
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      }
    };

    fetchSavedJobs();
  }, []);


  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  useEffect(() => {
    let updated = jobs;

    if (filters.keyword) {
      updated = updated.filter(
        (job) =>
          job.jobRole?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          job.companyName?.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.location && filters.location !== "All Locations") {
      updated = updated.filter((job) => job.location === filters.location);
    }

    if (filters.experience && filters.experience !== "All Experience Levels") {
      updated = updated.filter((job) => job.experience === filters.experience);
    }

    if (filters.salary && filters.salary !== "All Salary Ranges") {
      updated = updated.filter((job) => job.salary === filters.salary);
    }

    if (filters.designation && filters.designation !== "All Job Designations") {
      updated = updated.filter((job) => job.jobRole === filters.designation);
    }

    if (filters.qualification && filters.qualification !== "All Qualifications") {
      updated = updated.filter((job) => job.qualification === filters.qualification);
    }

    if (filters.company && filters.company !== "All Companies") {
      updated = updated.filter((job) => job.companyName === filters.company);
    }

    setFilteredJobs(updated);
  }, [filters, jobs]);


  const handleViewJD = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_PORTAL}/getRequirementById/${id}`
      );
      setSelectedJD(response.data);
      setShowJDModal(true);
    } catch (error) {
      console.error("Error fetching JD:", error);
      alert("Failed to fetch JD details.");
    }
  };

  const handleApplyNow = (job) => {
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || {};

    const currentCount = appliedJobs[job.requirementId] || 0;
    appliedJobs[job.requirementId] = currentCount + 1;

    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    const jobsList = JSON.parse(localStorage.getItem("jobsList")) || [];
    const updatedList = jobsList.map((j) =>
      j.requirementId === job.requirementId
        ? { ...j, applications: (j.applications || 0) + 1 }
        : j
    );
    localStorage.setItem("jobsList", JSON.stringify(updatedList));

    const event = new CustomEvent("applicationUpdated", {
      detail: { requirementId: job.requirementId },
    });
    window.dispatchEvent(event);

    navigate(`/apply/${job.requirementId}`, { state: { jobDetails: job } });
  };


  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedJob(null);
  };
  // const handleSendMessage = () => {
  //   if (newMessage.trim() === "") return;
  //   setMessages((prev) => [...prev, { sender: "candidate", text: newMessage }]);
  //   setNewMessage("");
  //   setTimeout(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       { sender: "recruiter", text: "Thanks for your message! We’ll get back soon." },
  //     ]);
  //   }, 1000);
  // };
  const handleSearchJobs = () => {
    let filtered = jobs;

    if (searchSkill.trim() !== "") {
      filtered = filtered.filter(job =>
        (job.skills?.toLowerCase().includes(searchSkill.toLowerCase())) ||
        (job.designation?.toLowerCase().includes(searchSkill.toLowerCase())) ||
        (job.jobRole?.toLowerCase().includes(searchSkill.toLowerCase()))
      );
    }

    if (searchExp !== "") {
      filtered = filtered.filter(job => job.experience?.includes(searchExp));
    }

    if (searchLocation.trim() !== "") {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
    setActiveSection("jobs");
    setShowSearchOverlay(false);
  };

  const handleLogout = async () => {
    if (!user || !user.userName) {
      console.error("User data not loaded yet");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_PORTAL}/logoutUser?userName=${user.userName}&userType=candidate`
      );

      logoutUser();
      setOpenPanel(null);
      console.log("Logout successful!")
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleBack = (event) => {
      if (activeSection !== "home") {
        event.preventDefault();
        setActiveSection("home");
        return;
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [activeSection]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
  }, []);



  return (
    <>
      {/* ===== NAVBAR TOP ===== */}
      <nav className="navbar">
        <div className="navbar-left">
          <div
            className="logo-container"
            onClick={() => setActiveSection("home")}
            style={{ cursor: "pointer" }}
          >
            <img src="/jobportal.jpg" alt="Logo" className="logo-img" />
            <h2 className="logo-text">RG Portal</h2>
          </div>


          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li onClick={() => setActiveSection("jobs")}>Jobs</li>

            <li
              className="nav-item-companies"
              onClick={() => setShowCompanies(!showCompanies)}
              ref={companyDropdownRef}
            >
              Companies
              {showCompanies && (
                <div className="company-dropdown">
                  <div
                    className={`company-item ${selectedCompany === "All Companies" ? "active-company" : ""
                      }`}
                    onClick={() => {
                      setSelectedCompany("All Companies");
                      setShowCompanies(false);
                    }}
                  >
                    All Companies
                  </div>

                  {companyNames.length > 0 ? (
                    companyNames.map((name, index) => (
                      <div
                        key={index}
                        className={`company-item ${selectedCompany === name ? "active-company" : ""
                          }`}
                        onClick={() => {
                          setSelectedCompany(name);
                          setShowCompanies(false);
                        }}
                      >
                        {name}
                      </div>
                    ))
                  ) : (
                    <div className="company-item">No companies found</div>
                  )}
                </div>
              )}
            </li>

            <li className="more-item" onClick={() => setShowDropdown((prev) => !prev)}>
              More ▾
              {showDropdown && (
                <ul className="more-dropdown">
                  <li>Communities</li>
                  <li>Reviews</li>
                  <li onClick={() => navigate("/salary-hike-calculator")}>Salary Hike Calculator</li>

                  <li
                    className="interview-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInterviewSubmenu((prev) => !prev);
                    }}
                  >
                    Interview ▸
                    {showInterviewSubmenu && (
                      <ul className="interview-submenu">
                        <li onClick={() => navigate("/interview-faqs")}>Interview FAQs</li>
                        <li onClick={() => navigate("/share-experience")}>Share your interview questions</li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>



          </ul>

          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        <div className="navbar-center">
          {activeSection !== "home" && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search jobs, companies..."
                onFocus={() => setShowSearchOverlay(true)}
                readOnly
              />
            </div>
          )}
        </div>

        <div className="navbar-right">

          <div className="jobs-click-container" ref={jobsRef}>
            <span className="jobs-label" onClick={() => togglePanel("jobs")}>
              My Jobs
            </span>

            {openPanel === "jobs" && (
              <div className="jobs-click-box">
                <div className="job-item">Recommended</div>
                <div
                  className="job-item"
                  onClick={() => navigate("/applied-jobs")}
                >
                  Applied
                </div>
                <div className="job-item" onClick={() => navigate("/saved-jobs")}>
                  Saved
                </div>
                <div className="job-item" onClick={() => navigate("/invites")}>
                  Invites
                </div>
              </div>
            )}
          </div>


          <div className="premium-click-container">
            <span
              className="premium-label"
              onClick={() => navigate("/premium")}
              style={{ cursor: "pointer", marginLeft: "15px", fontWeight: "bold" }}
            >
              Premium
            </span>
          </div>
          {/* <div
            className="nav-item messaging-item"
            onClick={() => setShowChatPopup(!showChatPopup)}
          >
            <FaEnvelope className="nav-icon-big" />
            <span className="nav-label">Messaging</span>
            {/* <span className="message-badge">3</span> */}
          {/* </div> */}

          <FaBell
            size={25}
            className="icon"
            title="Notifications"
            onClick={() => setShowNotifications(true)}
          />
          <div className="profile-section">
            <FaUserCircle
              size={25}
              className="icon"
              onClick={() => togglePanel("profile")}
            />
          </div>
        </div>
      </nav>

      {/* ===== MOBILE TOP NAVBAR ===== */}
      <div className="mobile-top-nav">
        <div className="m-logo" onClick={() => setActiveSection("home")}>
          <img src="/jobportal.jpg" alt="Logo" />
          <span>RG Portal</span>
        </div>

        <div className="m-icons">
          <FaBell
            className="m-notif-icon"
            size={23}
            onClick={() => setShowNotifications(true)}
          />

          <FaUserCircle
            className="m-profile-icon"
            size={25}
            onClick={() => togglePanel("profile")}
          />
        </div>
      </div>


      {/* ===== CHAT POPUP ===== */}
      {/* {showChatPopup && (
        <div className="candChat-popup-overlay">
          <div className="candChat-popup-box">
            <div className="candChat-popup-header">
              <h3>Messages</h3>
              <button
                className="candChat-popup-close"
                onClick={() => setShowChatPopup(false)}
              >
                ×
              </button>
            </div>

            <div className="candChat-popup-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`candChat-message ${msg.sender === "candidate" ? "candChat-sent" : "candChat-received"
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="candChat-popup-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={() => handleSendMessage()}>Send</button>
            </div>
          </div>
        </div>
      )} */}

      {/* ===== PROFILE PANEL ===== */}
      {openPanel === "profile" && (
        <div className="profile-panel open">
          <button className="close-btn" onClick={() => setOpenPanel(null)}>
            X
          </button>
          <div className="profile-top">
            <img src="icon.png" alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <h3>{user?.name || "Guest User"}</h3>
              <p>B.Sc Computer Science at Dr D Y Patil Law College, Pune</p>
              <button
                className="btn-update"
                onClick={() => navigate("/profile-page")}
              >
                View & Update Profile
              </button>
            </div>
          </div>

          <div className="performance-block">
            <p className="performance-text">
              Your Profile Performance - Last 90 days
            </p>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">107</span>
                <span className="stat-label">Search Appearances</span>
                <button className="view-btn">View All</button>
              </div>
              <div className="stat-item">
                <span className="stat-number">7</span>
                <span className="stat-label">Recruiter Actions</span>
                <button className="view-btn">View All</button>
              </div>
            </div>
          </div>

          <div className="quick-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/resume-templates");
                setOpenPanel(null);
              }}
            >
              <FaUsers className="quick-icon" /> Create Resume
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSettings(true);
                setOpenPanel(null);
              }}
            >
              <FaCog className="quick-icon" /> Settings
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowFAQ(true);
                setOpenPanel(null);
              }}
            >
              <FaQuestionCircle className="quick-icon" /> FAQs
            </a>


            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLogoutPopup(true);  // show popup
              }}
            >
              <FaSignOutAlt className="quick-icon" /> Logout
            </a>

          </div>
        </div>
      )}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h2>Account Settings</h2>
            <button className="close-settings" onClick={() => setShowSettings(false)}>
              ×
            </button>
          </div>

          <div className="settings-content">
            {/* ===== Sidebar ===== */}
            <div className="settings-sidebar">
              {["Profile", "Privacy", "Notifications", "Account", "Password", "Preferences", "Help & Support", "Logout"].map(
                (tab) => (
                  <div
                    key={tab}
                    className={`settings-tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                )
              )}
            </div>

            {/* ===== Main Content ===== */}
            <div className="settings-main fade-in">
              {activeTab === "Profile" && (
                <>
                  <h3>Profile Settings</h3>
                  <p>Manage your personal details and visibility.</p>
                  <form className="settings-form">
                    <label>
                      Full Name
                      <input type="text" value="Samruddhi Shekhar Patole" />
                    </label>
                    <label>
                      Email
                      <input type="email" value="samruddhi@example.com" />
                    </label>
                    <label>
                      Location
                      <input type="text" placeholder="Enter your location" />
                    </label>
                    <label>
                      Bio
                      <textarea placeholder="Write something about yourself..." />
                    </label>
                    <button type="button" className="save-settings">
                      Save Changes
                    </button>
                  </form>
                </>
              )}

              {activeTab === "Privacy" && (
                <>
                  <h3>Privacy Settings</h3>
                  <p>Control who can see your activity, contact info, and profile visibility.</p>
                  <div className="settings-option">
                    <label>
                      <input type="checkbox" defaultChecked /> Show my profile to recruiters
                    </label>
                    <label>
                      <input type="checkbox" /> Allow messages from unknown users
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Show my online status
                    </label>
                  </div>
                </>
              )}

              {activeTab === "Notifications" && (
                <>
                  <h3>Notification Preferences</h3>
                  <p>Choose how you want to be notified about job updates and messages.</p>
                  <div className="settings-option">
                    <label>
                      <input type="checkbox" defaultChecked /> Email notifications
                    </label>
                    <label>
                      <input type="checkbox" /> Push notifications
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Job recommendation alerts
                    </label>
                  </div>
                </>
              )}

              {activeTab === "Account" && (
                <>
                  <h3>Account Settings</h3>
                  <p>Manage account preferences and data.</p>
                  <button className="danger-btn">Deactivate Account</button>
                </>
              )}

              {activeTab === "Password" && (
                <>
                  <h3>Change Password</h3>
                  <form className="settings-form">
                    <label>
                      Current Password
                      <input type="password" />
                    </label>
                    <label>
                      New Password
                      <input type="password" />
                    </label>
                    <label>
                      Confirm Password
                      <input type="password" />
                    </label>
                    <button className="save-settings">Update Password</button>
                  </form>
                </>
              )}

              {activeTab === "Preferences" && (
                <>
                  <h3>Job Preferences</h3>
                  <p>Set your preferred roles, locations, and salary range.</p>
                  <form className="settings-form">
                    <label>
                      Preferred Role
                      <input type="text" placeholder="e.g. Frontend Developer" />
                    </label>
                    <label>
                      Preferred Location
                      <input type="text" placeholder="e.g. Pune, Mumbai" />
                    </label>
                    <label>
                      Expected Salary
                      <input type="text" placeholder="e.g. 5 LPA" />
                    </label>
                    <button className="save-settings">Save Preferences</button>
                  </form>
                </>
              )}

              {activeTab === "Help & Support" && (
                <>
                  <h3>Help & Support</h3>
                  <p>Need assistance? We're here to help.</p>
                  <ul className="help-list">
                    <li>📞 Contact Support: support@rgportal.com</li>
                    <li>📘 FAQ & Help Center</li>
                    <li>💡 Report a Problem</li>
                  </ul>
                </>
              )}

              {activeTab === "Logout" && (
                <>
                  <h3>Logout</h3>
                  <p>Are you sure you want to logout?</p>
                  <button className="danger-btn">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}



      {/* ===== MAIN SECTION BELOW NAVBAR ===== */}
      <div className="main-content-below-navbar">
        {activeSection === "home" && <HomePage />}

        {activeSection === "jobs" && (
          <div className="navDash-container">
            {/* Sidebar */}
            <div className="navDash-sidebar">
              {/* <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
                placeholder="Search by keyword..."
              /> */}

              <label>
                Location
                <select name="location" value={filters.location} onChange={handleChange}>
                  <option>All Locations</option>
                  {[...new Set(jobs.map((job) => job.location))].map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </label>

              <label>
                Experience
                <select name="experience" value={filters.experience} onChange={handleChange}>
                  <option>All Experience Levels</option>
                  {[...new Set(jobs.map((job) => job.experience))].map((exp) => (
                    <option key={exp}>{exp}</option>
                  ))}
                </select>
              </label>

              <label>
                Salary
                <select name="salary" value={filters.salary} onChange={handleChange}>
                  <option>All Salary Ranges</option>
                  {[...new Set(jobs.map((job) => job.salary))].map((sal) => (
                    <option key={sal}>{sal}</option>
                  ))}
                </select>
              </label>

              <label>
                Designation
                <select name="designation" value={filters.designation} onChange={handleChange}>
                  <option>All Job Designations</option>
                  {[...new Set(jobs.map((job) => job.jobRole))].map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>

              <label>
                Qualification
                <select name="qualification" value={filters.qualification} onChange={handleChange}>
                  <option>All Qualifications</option>
                  {[...new Set(jobs.map((job) => job.qualification))].map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </label>

              <label>
                Company
                <select name="company" value={filters.company} onChange={handleChange}>
                  <option>All Companies</option>
                  {[...new Set(jobs.map((job) => job.companyName))].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            {/* Job Cards */}
            <div className="navDash-jobContainer">
              <h2 className="navDash-jobContainer-heading">Jobs For You</h2>

              {loading ? (
                <p>Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <p>No jobs found.</p>
              ) : (
                <>
                  <div className="navDash-jobGrid">
                    {filteredJobs
                      .filter(
                        (job) =>
                          selectedCompany === "All Companies" ||
                          job.companyName === selectedCompany
                      )
                      .slice(0, visibleCount)
                      .map((job) => (
                        <div key={job.requirementId} className="navDash-jobCard">

                          <div className="navDash-jobHeader">
                            {job.companyLogo && (
                              <img
                                src={job.companyLogo}
                                alt="Company Logo"
                                className="navDash-companyLogo"
                              />

                            )}

                            <div className="navDash-jobInfo">
                              <p><strong>Company:</strong> {job.companyName}</p>
                              <p><strong>Location:</strong> {job.location}</p>
                              <p><strong>Experience:</strong> {job.experience}</p>
                              <p><strong>Job Role:</strong> {job.jobRole}</p>
                            </div>
                          </div>

                          {/* ✅ Bottom Buttons */}
                          <div className="navDash-jobActions">
                            {/* View JD - Bottom Left */}
                            <button
                              className="navDash-viewBtn"
                              onClick={() => handleViewJD(job.requirementId)}
                            >
                              View JD
                            </button>

                            {/* Save + Apply Now - Bottom Right */}
                            <div className="navDash-actionRight">
                              <button
                                className="navDash-saveBtn"
                                onClick={() => toggleSave(job.requirementId)}
                                title={
                                  savedJobs.includes(job.requirementId)
                                    ? "Unsave Job"
                                    : "Save Job"
                                }
                              >
                                {savedJobs.includes(job.requirementId) ? (
                                  <FaBookmark />
                                ) : (
                                  <FaRegBookmark />
                                )}
                              </button>

                              <button
                                className="navDash-applyBtn"
                                onClick={() => handleApplyNow(job)}
                              >
                                Apply Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Show More Button below grid */}
                  {visibleCount < jobs.length && (
                    <button
                      className="navDash-showMore"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                    >
                      Show More
                    </button>
                  )}
                </>
              )}

              {/* No CV Highlight */}
              <div className="no-cv-highlight">
                <div className="no-cv-text">
                  <h3>No CV? No Problem 🚀</h3>
                  <p>Create your professional resume instantly in minutes.</p>
                </div>

                <button
                  className="no-cv-create-btn"
                  onClick={() => navigate("/resume-templates")}
                >
                  Create Resume
                </button>
              </div>
            </div>

          </div>
        )}
      </div>


      {/* ===== JD MODAL ===== */}
      {showJDModal && selectedJD && (
        <div className="navDash-modalOverlay">
          <div className="navDash-modalBox">
            <button
              className="navDash-closeModal"
              onClick={() => setShowJDModal(false)}
            >
              ×
            </button>

            <h2 className="navDash-modalTitle">Job Description Details</h2>

            <div className="navDash-modalScroll">
              <section className="navDash-section">
                <h3>Overview</h3>
                <div className="navDash-grid">
                  <p>
                    <strong>Requirement ID:</strong> {selectedJD.requirementId}
                  </p>
                  <p>
                    <strong>Company Name:</strong> {selectedJD.companyName}
                  </p>
                  <p>
                    <strong>Designation:</strong> {selectedJD.designation}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedJD.location}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {selectedJD.jobType}
                  </p>
                  <p>
                    <strong>Salary:</strong> {selectedJD.salary}
                  </p>
                  <p>
                    <strong>Experience:</strong> {selectedJD.experience}
                  </p>
                  <p>
                    <strong>Shift:</strong> {selectedJD.shift}
                  </p>
                  <p>
                    <strong>Week Off:</strong> {selectedJD.weekOff}
                  </p>
                  <p>
                    <strong>Notice Period:</strong> {selectedJD.noticePeriod}
                  </p>
                </div>
              </section>

              <section className="navDash-section">
                <h3>Qualification & Skills</h3>
                <div className="navDash-grid">
                  <p>
                    <strong>Qualification:</strong> {selectedJD.qualification}
                  </p>
                  <p>
                    <strong>Field:</strong> {selectedJD.field}
                  </p>
                  <p>
                    <strong>Stream:</strong> {selectedJD.stream}
                  </p>
                  <p>
                    <strong>Percentage:</strong> {selectedJD.percentage}
                  </p>
                  <p>
                    <strong>Skills:</strong> {selectedJD.skills}
                  </p>
                </div>
              </section>

              <section className="navDash-section">
                <h3>Perks & Other Details</h3>
                <div className="navDash-grid">
                  <p>
                    <strong>Perks:</strong> {selectedJD.perks}
                  </p>
                  <p>
                    <strong>Incentive:</strong> {selectedJD.incentive}
                  </p>
                  <p>
                    <strong>Reporting Hierarchy:</strong>{" "}
                    {selectedJD.reportingHierarchy}
                  </p>
                  <p>
                    <strong>Bond:</strong> {selectedJD.bond}
                  </p>
                  <p>
                    <strong>Documentation:</strong> {selectedJD.documentation}
                  </p>
                  <p>
                    <strong>Age Criteria:</strong> {selectedJD.ageCriteria}
                  </p>
                </div>
              </section>

              <section className="navDash-section">
                <h3>Responsibilities</h3>
                {selectedJD.responsibilities?.length > 0 ? (
                  <ul>
                    {selectedJD.responsibilities.map((r, i) => (
                      <li key={i}>{r.responsibilitiesMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No responsibilities provided.</p>
                )}
              </section>

              <section className="navDash-section">
                <h3>Job Requirements</h3>
                {selectedJD.jobRequirements?.length > 0 ? (
                  <ul>
                    {selectedJD.jobRequirements.map((r, i) => (
                      <li key={i}>{r.jobRequirementMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No job requirements provided.</p>
                )}
              </section>

              <section className="navDash-section">
                <h3>Preferred Qualifications</h3>
                {selectedJD.preferredQualifications?.length > 0 ? (
                  <ul>
                    {selectedJD.preferredQualifications.map((r, i) => (
                      <li key={i}>{r.preferredQualificationMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No preferred qualifications provided.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
      {showFAQ && (
        <div className="faq-overlay">
          <div className="faq-container">
            <div className="faq-header">
              <h2>Help & Support</h2>
              <button className="faq-close" onClick={() => setShowFAQ(false)}>×</button>
            </div>

            <div className="faq-content">
              <details>
                <summary>How can i create an portal account </summary>
                <p>Open the website then register first then fill the details after completing your profile will create successfully You can check it by visiting Pofile section</p>
              </details>

              <details>
                <summary>How Can i create a Resume</summary>
                <p>Go to Profile - Create Resume - Download Resume</p>
              </details>

              <details>
                <summary>How To do Interview prepartion</summary>
                <p>More - Interview - Interview FAQs</p>
              </details>

              <details>
                <summary>How To do Interview prepartion</summary>
                <p>More - Interview - Interview FAQs</p>
              </details>

              <details>
                <summary>How do I apply for a job?</summary>
                <p>Browse jobs → Click "Apply" - Fill details - Submit application.</p>
              </details>

              <details>
                <summary>Can I edit my profile after submission?</summary>
                <p>Yes, go to Profile - Edit, and update details anytime.</p>
              </details>

              <details>
                <summary>How do I upload a resume?</summary>
                <p>Visit Profile - Resume section - Upload PDF/DOCX - Save.</p>
              </details>

              <details>
                <summary>How do recruiters contact me?</summary>
                <p>You will receive invites , notification & email from company HR.</p>
              </details>

              <details>
                <summary>Is this platform free for job seekers?</summary>
                <p>Yes, applying and creating resume is 100% free.</p>
              </details>

              <details>
                <summary>How Can I change my Acocunt Password</summary>
                <p>Got to Settings - Password - Change My Password</p>
              </details>

              <details>
                <summary>How can i get the extra information related to portal or career</summary>
                <p>By Chatbot </p>
              </details>

              <details>
                <summary> How Can I deactivate My Acount</summary>
                <p>Goto Settings - Account - Deactivate Account</p>
              </details>
            </div>
          </div>
        </div>
      )}
      {showLogoutPopup && (
        <div
          className="logout-overlay"
          onClick={() => setShowLogoutPopup(false)} // clicking outside closes
        >
          <div
            className="logout-sheet"
            onClick={(e) => e.stopPropagation()} // ✅ buttons work now
          >
            <h2>Logout?</h2>
            <p>Are you sure you want to logout from your account?</p>

            {/* <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                setShowLogoutPopup(false);
                navigate("/login");
              }}
            >
              Yes, Logout
            </button> */}
            <button className="logout-btn" onClick={handleLogout}>Yes, Logout</button>

            <button
              className="cancel-btn"
              onClick={() => setShowLogoutPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showNotifications && (
        <div className="notif-overlay" onClick={() => setShowNotifications(false)}>
          <div
            className="notif-panel"
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
          >
            <div className="notif-header">
              <h3>Notifications</h3>
              <button className="notif-close" onClick={() => setShowNotifications(false)}>
                ×
              </button>
            </div>

            <div className="notif-list">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="notif-item">
                    <p>{n.message}</p>
                    <span>{n.time}</span>
                  </div>
                ))
              ) : (
                <p className="no-notifs">No new notifications</p>
              )}
            </div>

            <button className="clear-btn" onClick={() => setNotifications([])}>
              Clear All
            </button>
          </div>
        </div>
      )}
      {showSearchOverlay && (
        <div className="rgSearch-top">
          <div className="rgSearch-wrapper">
            {/* ===== Logo and Title ===== */}
            <div className="rgSearch-left">
              <img src="/jobportal.jpg" alt="RG Portal Logo" className="rgSearch-logo" />
              <span className="rgSearch-title">RG Portal</span>
            </div>

            {/* ===== Search Fields ===== */}
            <div className="rgSearch-fields">
              <input
                type="text"
                placeholder="Enter Skills, Designation etc"
                className="rgSearch-input"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
              />

              <select
                className="rgSearch-select"
                value={searchExp}
                onChange={(e) => setSearchExp(e.target.value)}
              >
                <option value="">Experience</option>
                {[...Array(11).keys()].map((n) => (
                  <option key={n} value={n}>{n} year{n !== 1 ? "s" : ""}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location"
                className="rgSearch-input"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />

              <button className="rgSearch-btn" onClick={handleSearchJobs}>
                Let’s Find
              </button>

            </div>

            {/* ===== Close Button ===== */}
            <button className="rgSearch-close" onClick={() => setShowSearchOverlay(false)}>
              ×
            </button>
          </div>
        </div>
      )}

      <ChatBot />

      {/* ===== MOBILE BOTTOM NAVBAR ===== */}
      <div className="mobile-bottom-nav">
        <div
          className={`m-item ${activeSection === "home" ? "active" : ""}`}
          onClick={() => setActiveSection("home")}
        >
          <FaHome />
          <span>Home</span>
        </div>

        <div
          className={`m-item ${activeSection === "jobs" ? "active" : ""}`}
          onClick={() => setActiveSection("jobs")}
        >
          <FaBriefcase />
          <span>Jobs</span>
        </div>

        <div
          className={`m-item ${activeSection === "saved" ? "active" : ""}`}
          onClick={() => navigate("/saved-jobs")}
        >
          <FaBookmark />
          <span>Saved</span>
        </div>

        <div
          className={`m-item ${openPanel === "profile" ? "active" : ""}`}
          onClick={() => togglePanel("profile")}
        >
          <FaUserCircle />
          <span>Profile</span>
        </div>


      </div>

    </>
  );
};

export default Navbar;
