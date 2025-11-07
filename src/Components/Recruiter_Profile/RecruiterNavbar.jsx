// Samruddhi Patole 29/10/25
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  FaClipboardList,
  FaUserTie,
  FaSearch,
} from "react-icons/fa";
import "./RecruiterNavbar.css";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const RecruiterNavbar = () => {
  // const API_BASE_URL = "http://localhost:8080";

  const [activePage, setActivePage] = useState("home");
  const [showJDModal, setShowJDModal] = useState(false);
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { sender: "Candidate", text: "Hello, is this position still open?" },
    { sender: "You", text: "Yes, please share your updated resume." },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showApplicantsPopup, setShowApplicantsPopup] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(3);
  //  const [companies, setCompanies] = useState([]);
  //   const [showCompanies, setShowCompanies] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "All Locations",
    experience: "All Experience Levels",
    salary: "All Salary Ranges",
    designation: "All Job Designations",
    qualification: "All Qualifications",
    company: "All Companies",
  });

  const params = new URLSearchParams(location.search);
  const userType = params.get("userType");

  // 💬 Chat Popup States
  // const [showChatPopup, setShowChatPopup] = useState(false);
  // const [messages, setMessages] = useState([
  //   { sender: "Candidate", text: "Hello, is this position still open?" },
  //   { sender: "You", text: "Yes, it is! Please share your updated resume." },
  // ]);
  // const [newMessage, setNewMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const jobsRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const [designationSuggestions, setDesignationSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);


  // Close profile panel on outside click
  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (
  //         openPanel === "profile" &&
  //         jobsRef.current &&
  //         !jobsRef.current.contains(event.target)
  //       ) {
  //         setOpenPanel(null);
  //       }
  //     };
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, [openPanel]);
  //  const handleCompaniesClick = async () => {
  //     try {
  //       if (!showCompanies) {
  //         const response = await axios.get("http://localhost:8080/api/requirements/companies");
  //         setCompanies(response.data);
  //       }
  //       setShowCompanies((prev) => !prev); // toggle modal open/close
  //     } catch (error) {
  //       console.error("Error fetching companies:", error);
  //       alert("Failed to fetch company list.");
  //     }
  //   };
  const API_BASE_URL = "http://localhost:8080";

  const handleDelete = async (requirementId) => {
    if (!window.confirm("Are you sure you want to delete this job description?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/requirements/delete/${requirementId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("Job deleted successfully!");
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job.requirementId !== requirementId)
        );
      } else {
        toast.error("Failed to delete job!");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Error connecting to backend!");
    }
  };


  const currentYear = new Date().getFullYear();

  const handleViewApplicants = async (requirementId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/applications/requirement/${requirementId}`);

      setApplicants(response.data);
      setSelectedJobId(requirementId);
      setShowApplicantsPopup(true);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };


  const handleEdit = (requirementId) => {
    navigate(`/add-job-description/${requirementId}`);
  };


  // ✅ Fetch jobs and listen to Apply count updates
  // ✅ Fetch jobs only once from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/requirements/all`);

        let jobList = response.data.map(job => ({
          ...job,
          applications: 0 // initialize
        }));

        // ✅ GET LIVE APPLICATION COUNT FOR EACH JOB
        for (const job of jobList) {
          const res = await axios.get(`${API_BASE_URL}/api/applications/requirement/${job.requirementId}`);
          job.applications = res.data.length; // real-time count
        }

        setAllJobs(jobList);
        setJobs(jobList);
        setFilteredJobs(jobList);

      } catch (error) {
        console.error("❌ Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  // Fetch recruiter’s posted jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/requirements/all`);
        setJobs(res.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleTestType = (type) => {
    setShowTestPopup(false);
    if (type === "technical") navigate("/add-technical-test");
    else navigate("/add-non-technical-test");
  };

  const togglePanel = (panel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const handleAddJD = () => {
    navigate("/paid-post");
  };

  const handleAddTest = () => {
    setShowTestPopup(true);
  };

  const handleViewJD = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/requirements/${id}`);
      setSelectedJD(response.data);
      setShowJDModal(true);
    } catch (err) {
      console.error("Error fetching JD:", err);
      alert("Failed to load JD details.");
    }
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="recNav-navbar">
        <div
          className="recNav-left"
          onClick={() => setActivePage("home")}
          style={{ cursor: "pointer" }}
        >
          <img src="/jobportal.jpg" alt="Logo" className="recNav-logo-img" />
          <h2 className="recNav-logo-text">RG Portal</h2>
        </div>


        <div className="recNav-center">
          <span className="recSidebar-addJD-btn" onClick={() => setActivePage("applicants")}>Applicants</span>
          <span className="recSidebar-addJD-btn" onClick={handleAddJD}>
            Add JD
          </span>
          <span className="recSidebar-addTest-btn" onClick={handleAddTest}>
            Add Test
          </span>        </div>

        <div className="recNav-right">
          <div className="recNav-item" onClick={() => setShowChatPopup(true)}>
            {/* <FaEnvelope className="recNav-icon-big" />
            <span className="recNav-label">Messaging</span> */}
          </div>
          <div className="recNav-item">
            <FaUserCircle
              className="recNav-icon-big"
              onClick={() => togglePanel("profile")}
            />
            <span className="recNav-label">Profile</span>
          </div>
        </div>
      </nav>

            {/* ===== Profile Panel ===== */}
      {openPanel === "profile" && (
        <div className="recNav-profile-panel recNav-open">
          <button className="recNav-close-btn" onClick={() => setOpenPanel(null)}>
            X
          </button>
          <div className="recNav-profile-top">
            <img src="icon.png" alt="Profile" className="recNav-profile-pic" />
            <div className="recNav-profile-info">
              <h3>Samruddhi Shekhar Patole</h3>
              <p>B.Sc Computer Science at Dr D Y Patil Law College, Pune</p>
              <button className="recNav-btn-update">View & Update Profile</button>
            </div>
          </div>

          <div className="recNav-performance-block">
            <p className="recNav-performance-text">Your Profile Performance</p>
            <div className="recNav-stats">
              <div className="recNav-stat-item">
                <span className="recNav-stat-number">107</span>
                <span className="recNav-stat-label">Search Appearances</span>
                <button className="recNav-view-btn">View All</button>
              </div>
              <div className="recNav-stat-item">
                <span className="recNav-stat-number">7</span>
                <span className="recNav-stat-label">Recruiter Actions</span>
                <button className="recNav-view-btn">View All</button>
              </div>
            </div>
          </div>

          <div className="recNav-quick-links">
            <a href="#">
              <FaCog className="recNav-quick-icon" /> Settings
            </a>
            <a href="#">
              <FaQuestionCircle className="recNav-quick-icon" /> FAQs
            </a>
            <a href="#">
              <FaSignOutAlt className="recNav-quick-icon" /> Logout
            </a>
          </div>
        </div>
      )}

      {/* ===== TEST TYPE POPUP ===== */}
      {showTestPopup && (
        <div className="test-popup-overlay">
          <div className="test-popup-box">
            <h3>Select Test Type</h3>
            <div className="test-popup-buttons">
              <button
                className="popup-btn-technical"
                onClick={() => handleTestType("technical")}
              >
                Technical
              </button>
              <button
                className="popup-btn-nontechnical"
                onClick={() => handleTestType("nontechnical")}
              >
                Non-Technical
              </button>
            </div>
            <button
              className="popup-close-btn"
              onClick={() => setShowTestPopup(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ===== JD DETAILS MODAL ===== */}
      {showJDModal && selectedJD && (
        <div className="jd-modal-overlay">
          <div className="jd-modal-box">
            <button className="jd-modal-close" onClick={() => setShowJDModal(false)}>
              ×
            </button>

            <h2 className="jd-modal-title">Job Description Details</h2>
<div className="jd-modal-scroll">
              <section className="jd-section">
                <h3>Overview</h3>
                <div className="jd-grid">
                  <p><strong>Requirement ID:</strong> {selectedJD.requirementId}</p>
                  <p><strong>Company Name:</strong> {selectedJD.companyName}</p>
                  <p><strong>Designation:</strong> {selectedJD.designation}</p>
                  <p><strong>Location:</strong> {selectedJD.location}</p>
                  <p><strong>Job Type:</strong> {selectedJD.jobType}</p>
                  <p><strong>Salary:</strong> {selectedJD.salary}</p>
                  <p><strong>Experience:</strong> {selectedJD.experience}</p>
                  <p><strong>Shift:</strong> {selectedJD.shift}</p>
                  <p><strong>Week Off:</strong> {selectedJD.weekOff}</p>
                  <p><strong>Notice Period:</strong> {selectedJD.noticePeriod}</p>
                </div>
              </section>
              <section className="jd-section">
                <h3>Qualification & Skills</h3>
                <div className="jd-grid">
                  <p><strong>Qualification:</strong> {selectedJD.qualification}</p>
                  <p><strong>Field:</strong> {selectedJD.field}</p>
                  <p><strong>Stream:</strong> {selectedJD.stream}</p>
                  <p><strong>Percentage:</strong> {selectedJD.percentage}</p>
                  <p><strong>Skills:</strong> {selectedJD.skills}</p>
                </div>
              </section>
              <section className="jd-section">
                <h3>Perks & Other Details</h3>
                <div className="jd-grid">
                  <p><strong>Perks:</strong> {selectedJD.perks}</p>
                  <p><strong>Incentive:</strong> {selectedJD.incentive}</p>
                  <p><strong>Reporting Hierarchy:</strong> {selectedJD.reportingHierarchy}</p>
                  <p><strong>Bond:</strong> {selectedJD.bond}</p>
                  <p><strong>Documentation:</strong> {selectedJD.documentation}</p>
                  <p><strong>Age Criteria:</strong> {selectedJD.ageCriteria}</p>
                </div>
              </section>
              <section className="jd-section">
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
              <section className="jd-section">
                <h3>Job Requirements</h3>
                {selectedJD.jobRequirements?.length > 0 ? (
                  <ul>
                    {selectedJD.jobRequirements.map((r, i) => (
                      <li key={i}>{r.jobRequirementMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No requirements provided.</p>
                )}
              </section>
              <section className="jd-section">
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

      {/* ===== CHAT POPUP ===== */}
      {/* {showChatPopup && (
        <div className="chat-popup-overlay">
          <div className="chat-popup-box">
            <div className="chat-popup-header">
              <h3>Messages</h3>
              <button
                className="chat-popup-close"
                onClick={() => setShowChatPopup(false)}
              >
                ×
              </button>
            </div>

            <div className="chat-popup-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-message ${msg.sender === "You" ? "chat-sent" : "chat-received"
                    }`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-popup-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                onClick={() => {
                  if (newMessage.trim()) {
                    setMessages([...messages, { sender: "You", text: newMessage }]);
                    setNewMessage("");
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN HOMEPAGE ===== */}
      {activePage === "home" && (
        <div className="recruiter-home">
          <h1>Recruiter Dashboard</h1>

          {/* === Stats Section === */}
          <div className="stats-cards">
            <div className="stat-card">
              <FaUsers size={28} color="#1976d2" />
              <h3>Total Candidates</h3>
              <p>148</p>
            </div>
            <div className="stat-card">
              <FaClipboardList size={28} color="#43a047" />
              <h3>Shortlisted</h3>
              <p>36</p>
            </div>
            <div className="stat-card">
              <FaUserTie size={28} color="#f57c00" />
              <h3>Interviews Scheduled</h3>
              <p>12</p>
            </div>
          </div>

          {/* === Search Bar === */}
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search candidates by name, skills, or location..."
            />
            <button>Search</button>
          </div>

          {/* === My Posted Jobs === */}
          <h2 className="section-title">My Posted Jobs</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs posted yet.</p>
          ) : (
            <div className="job-card-container">
              {jobs.map((job) => (
                <div key={job.requirementId} className="job-card">
                  <h3>{job.designation}</h3>
                  <p><strong>Company:</strong> {job.companyName}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Experience:</strong> {job.experience}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <div className="job-card-actions">
                    <button onClick={() => handleViewJD(job.requirementId)}>
                      View JD
                    </button>
                    <button>View Applicants</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activePage === "applicants" && (
        <div className="recApplicantsSection">
          <h2>My Posted Jobs</h2>

          <div className="recJobContainer">
            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p>No jobs found.</p>
            ) : (
              <>
                {jobs.slice(0, visibleCount).map((job) => (
                  <div key={job.requirementId} className="recJobCard">
                    <div className="recJobCard-left">
                      <p><strong>Requirement ID:</strong> {job.requirementId}</p>
                      <p><strong>Company Name :</strong> {job.companyName}</p>
                      <p><strong>Location:</strong> {job.location}</p>
                      <p><strong>Experience:</strong> {job.experience}</p>
                      <p><strong>Designation:</strong> {job.designation}</p>
                    </div>

                    <div className="recJobCard-right">
                      <p>
                        <strong>Applications:</strong>{" "}
                        <button
                          className="app-count-btn"
                          onClick={() => handleViewApplicants(job.requirementId)}
                        >
                          {job.applications}
                        </button>
                      </p>
                    </div>



                    <div
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        textAlign: "right",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px", // spacing between buttons
                      }}
                    >
                      {/* {userType === "PortalEmp" && ( */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                          className="recJobCard-edit-btn"
                          onClick={() => handleEdit(job.requirementId)}
                          title="Edit Job"
                        >
                          <FaPencilAlt />
                        </button>

                        <button
                          className="recJobCard-delete-btn"
                          onClick={() => handleDelete(job.requirementId)}
                          title="Delete Job"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>


                      <button
                        className="recJobCard-view-btn"
                        onClick={() => handleViewJD(job.requirementId)}
                      >
                        View JD
                      </button>
                    </div>
                  </div>
                ))}

                {visibleCount < jobs.length && (
                  <button
                    className="recJobCard-showmore-btn"
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    style={{ marginTop: "20px" }}
                  >
                    Show More
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== APPLICANTS POPUP ===== */}
      {showApplicantsPopup && (
        <div className="applicant-popup-overlay">
          <div className="applicant-popup-box new-applicant-box">
            <div className="applicant-header">
              <h3>Applicants ({applicants.length})</h3>
              <button
                className="popup-close-btn"
                onClick={() => setShowApplicantsPopup(false)}
              >
                ×
              </button>
            </div>

            {applicants.length === 0 ? (
              <p className="no-applicants">No applicants yet.</p>
            ) : (
              <div className="applicant-table-container">
                <table className="applicant-table modern-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Education</th>
                      <th>Applied</th>
                      <th>Test Score</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants
                      .slice()
                      .sort((a, b) => {
                        // If both have scores → sort descending
                        if (a.testScore != null && b.testScore != null) {
                          return b.testScore - a.testScore;
                        }
                        // If only a has score → a first
                        if (a.testScore != null && b.testScore == null) {
                          return -1;
                        }
                        // If only b has score → b first
                        if (a.testScore == null && b.testScore != null) {
                          return 1;
                        }
                        // Both no score → keep original order
                        return 0;
                      })
                      .map((c, i) => (
                        <tr key={i}>
                          <td>{c.fullName}</td>
                          <td>{c.contactNumber}</td>
                          <td>{c.educationalQualification}</td>
                          <td>{new Date(c.submittedAt).toLocaleDateString()}</td>
                          <td>
                            {c.testScore != null ? c.testScore : "Test not given"}
                          </td>
                          <td>
                            <button className="btn-small view-btn">View Resume</button>
                            <button className="btn-small primary-btn">Shortlist</button>
                            <button className="btn-small danger-btn">Reject</button>
                          </td>
                        </tr>
                      ))}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}


      <footer className="recFooter-footer">
        <div className="recFooter-content">
          <div className="recFooter-left">
            <p>© {currentYear} RG Portal. All rights reserved.</p>
          </div>
          <div className="recFooter-right">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/support">Support</a>
          </div>
        </div>
      </footer>

    </>
  );
};

export default RecruiterNavbar;