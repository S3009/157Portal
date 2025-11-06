// Samruddhi Patole 29/10/25
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaUserCircle,
  FaUsers,
  FaClipboardList,
  FaUserTie,
  FaSearch,
} from "react-icons/fa";
import "./RecruiterNavbar.css";

const RecruiterNavbar = () => {
  const API_BASE_URL = "http://localhost:8080";

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
  const [visibleCount, setVisibleCount] = useState(3);
  const [allJobs, setAllJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showApplicantsPopup, setShowApplicantsPopup] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);

  const currentYear = new Date().getFullYear();

  const navigate = useNavigate();

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
            <FaEnvelope className="recNav-icon-big" />
            <span className="recNav-label">Messaging</span>
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
                  <p><strong>Company:</strong> {selectedJD.companyName}</p>
                  <p><strong>Designation:</strong> {selectedJD.designation}</p>
                  <p><strong>Location:</strong> {selectedJD.location}</p>
                  <p><strong>Salary:</strong> {selectedJD.salary}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* ===== CHAT POPUP ===== */}
      {showChatPopup && (
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

                    <div style={{ width: "100%", marginTop: "10px", textAlign: "right" }}>
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
