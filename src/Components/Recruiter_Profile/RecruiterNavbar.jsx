// Samruddhi Patole 29/10/25
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateCard from "./CandidateCard";


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
import { useLocation } from "react-router-dom";

import "./RecruiterNavbar.css";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_PORTAL, API_BASE_URL } from "../../API/api";
import { useUser } from "../UserContext"; // adjust the path

const RecruiterNavbar = () => {
  // const API_BASE_URL = "http://localhost:8080";
    const { loginUser } = useUser();
// console.log("LOGGED IN USER DETAILS:",loginUser)

const location = useLocation();
  const { user, logoutUser } = useUser(); 

// override role if URL contains "newRecruiter"
const effectiveRole = location.pathname.includes("newRecruiter")
  ? "recruiter"
  : user?.role?.toLowerCase();

  const [appliedJobs, setAppliedJobs] = useState([]);
const [searchedCandidates, setSearchedCandidates] = useState([]);
const [showCandidates, setShowCandidates] = useState(false);


  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

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
  const [candidateCount, setCandidateCount] = useState(0);

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
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteCandidates, setInviteCandidates] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
console.log("Logged in userType =", user);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "All Locations",
    experience: "All Experience Levels",
    salary: "All Salary Ranges",
    designation: "All Job Designations",
    qualification: "All Qualifications",
    company: "All Companies",
  });
const getApplicationId = (a) => {
  return a.applicationId || a.jobApplicationId || a.id;
};

  const params = new URLSearchParams(location.search);
  // const userType = params.get("userType");

  // 💬 Chat Popup States
  // const [showChatPopup, setShowChatPopup] = useState(false);
  // const [messages, setMessages] = useState([
  //   { sender: "Candidate", text: "Hello, is this position still open?" },
  //   { sender: "You", text: "Yes, it is! Please share your updated resume." },
  // ]);
  // const [newMessage, setNewMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
const [selectAll, setSelectAll] = useState(false);
  const jobsRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const [designationSuggestions, setDesignationSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

const handleViewResume = async (jobAppId) => {
  try {
    const appData = await getBackendApplication(jobAppId);
    if (!appData) return;

    const currentStatus = appData.status;

    if (statusOrder["viewed"] <= statusOrder[currentStatus]) {
      // already viewed → directly navigate
      navigate("/navbar");
      return;
    }

    await axios.post(`${API_BASE_PORTAL}/markViewed/${jobAppId}`);

    const updatedApp = await getBackendApplication(jobAppId);

    setApplicants(prev =>
      prev.map(a =>
        a.jobApplicationId === jobAppId
          ? { ...a, status: updatedApp.status }
          : a
      )
    );

    toast.success("Application viewed");

    // ⭐ Navigate to Recruiter Navbar Home
    navigate("/navbar");

  } catch (err) {
    console.error("Error updating view:", err);
  }
};



useEffect(() => {
  const fetchRecruiterJobs = async () => {
    try {
      if (effectiveRole === "recruiter") {
        const response = await axios.get(
          "https://rg.157careers.in/api/ats/157industries/fetch-all-job-descriptions/1/Recruiters"
        );

        console.log("Recruiter JD List:", response.data);

        // 🔥 Add applicant count for every recruiter JD
        const jobList = await Promise.all(
          response.data.map(async (job) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/jobportal/getByRequirement/${job.requirementId}`
              );

              return {
                ...job,
                applications: res.data.length,  // ⭐ SAME AS portalemp
              };
            } catch (err) {
              console.error("Error fetching applicant count:", err);
              return { ...job, applications: 0 };
            }
          })
        );

        setJobs(jobList);
        setFilteredJobs(jobList);
        setAllJobs(jobList);
      }
    } catch (error) {
      console.error("Error fetching recruiter job descriptions:", error);
    }
  };

  fetchRecruiterJobs();
}, [effectiveRole]);
//samruddhi
// useEffect(() => {
//   if (!searchQuery.trim()) {
//     setFilteredJobs(jobs);
//     return;
//   }

//   const filtered = jobs.filter((job) =>
//     job.designation
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   setFilteredJobs(filtered);
// }, [searchQuery, jobs]);
useEffect(() => {
  const fetchCandidatesByDesignation = async () => {

    // 🔹 If search is empty → show JD list
    if (!searchQuery.trim()) {
      setShowCandidates(false);
      setSearchedCandidates([]);
      return;
    }

    try {
const res = await axios.get(
  "http://localhost:8080/api/profile/search/candidates",
  {
    params: { designation: searchQuery }
  }
);


      setSearchedCandidates(res.data);
      setShowCandidates(true);

    } catch (error) {
      console.error("Candidate search failed", error);
      toast.error("Failed to fetch candidates");
    }
  };

  fetchCandidatesByDesignation();
}, [searchQuery]);


const getBackendApplication = async (jobAppId) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/jobportal/getApplicationByJobAppId/${jobAppId}`
    );
    return res.data; 
  } catch (err) {
    console.error("Error fetching application:", err);
    return null;
  }
};

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
  // const API_BASE_URL = "http://localhost:8080";

  const handleDelete = async (requirementId) => {
    if (!window.confirm("Are you sure you want to delete this job description?")) return;

    try {
      const response = await fetch(
        `${API_BASE_PORTAL}/delete/${requirementId}`,
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
    const response = await axios.get(
      `http://localhost:8080/api/jobportal/getByRequirement/${requirementId}`
    );

    const applicants = response.data || [];

    const applicantsWithStatus = await Promise.all(
      applicants.map(async (a) => {
        const appData = await getBackendApplication(a.id);
        return {
          ...a,
jobApplicationId: a.jobApplicationId || a.id,
          applicationId: appData?.id,
          status: appData?.status || "pending"
        };
      })
    );

    setApplicants(applicantsWithStatus);
    setSelectedJobId(requirementId);
    setShowApplicantsPopup(true);

  } catch (error) {
    console.error("Error loading applicants:", error);
  }
};

const statusOrder = {
  pending: 1,
  viewed: 2,
  shortlisted: 3,
  hired: 4
};


const updateStatus = async (jobAppId, newStatus) => {
  try {
    const appData = await getBackendApplication(jobAppId);
    if (!appData) return;

    const currentStatus = appData.status;

    if (statusOrder[newStatus] <= statusOrder[currentStatus]) {
      toast.info(`Cannot change status backward. Current: ${currentStatus}`);
      return;
    }

    await axios.post(`${API_BASE_PORTAL}/updateStatus`, {
      jobApplicationId: jobAppId,
      status: newStatus,
    });

    const updatedApp = await getBackendApplication(jobAppId);

    setApplicants(prev =>
      prev.map(a =>
        a.jobApplicationId === jobAppId
          ? { ...a, status: updatedApp.status }
          : a
      )
    );

    toast.success(`Status updated to ${updatedApp.status}`);

  } catch (err) {
    console.error("Status update failed:", err);
    toast.error("Failed to update status");
  }
};



  const handleEdit = (requirementId) => {
    navigate(`/add-job-description/${requirementId}`);
  };
const handleSentInvites = async (requirementId, designation) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/jobportal/getByRequirement/${requirementId}`
    );

    if (!res.data || res.data.length === 0) {
      toast.warning("No candidates have applied for this job yet");
      return;
    }

    setInviteCandidates(res.data);
    setCandidateCount(res.data.length);
    setSelectedJobId(requirementId);
    setSelectedJobTitle(designation);
    setSelectedCandidateIds([]); // reset selection
    setSelectAll(false);
    setShowInvitePopup(true);

  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch applied candidates");
  }
};

const toggleCandidate = (candidateId) => {
  setSelectedCandidateIds((prev) =>
    prev.includes(candidateId)
      ? prev.filter((id) => id !== candidateId)
      : [...prev, candidateId]
  );
};

const toggleSelectAll = () => {
  if (selectAll) {
    setSelectedCandidateIds([]);
  } else {
    setSelectedCandidateIds(inviteCandidates.map(c => c.candidateId));
  }
  setSelectAll(!selectAll);
};



const handleSendAllInvites = async () => {
  try {
    const recruiterId = user?.userId;
    if (!recruiterId) {
      toast.error("Recruiter ID missing");
      return;
    }

    for (const candidateId of selectedCandidateIds) {
      await axios.post(
        `${API_BASE_PORTAL}/api/jobportal/sendInvite`,
        null,
        {
          params: {
            candidateId,
            recruiterId,
            requirementId: selectedJobId,
          },
        }
      );
    }

    toast.success(`Invites sent to ${selectedCandidateIds.length} candidates`);
    setShowInvitePopup(false);

  } catch (error) {
    console.error(error);
    toast.error("Failed to send invites");
  }
};

useEffect(() => {
  const fetchPortalEmpJobs = async () => {
    try {
      if (effectiveRole === "portalemp") {
        setLoading(true);


        const response = await axios.get(
          "http://localhost:8080/api/jobportal/getAllRequirements"
        );

        // 🔥 Fetch real applicant count for each JD
        let jobList = await Promise.all(
          response.data.map(async (job) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/jobportal/getByRequirement/${job.requirementId}`
              );

              return {
                ...job,
                applications: res.data.length, // <-- REAL COUNT
              };
            } catch (err) {
              console.error("Error fetching count:", err);
              return {
                ...job,
                applications: 0,
              };
            }
          })
        );


        setJobs(jobList);
        setFilteredJobs(jobList);
        setAllJobs(jobList);
      }

    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPortalEmpJobs();
}, [effectiveRole]);


// useEffect(() => {
//   if (effectiveRole !== "portalemp") return;  // ⛔ skip for newRecruiter

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:8080/api/jobportal/getAllRequirements");

//       let jobList = response.data.map(job => ({
//         ...job,
//         applications: 0
//       }));

//       for (const job of jobList) {
//         const res = await axios.get(
//           `http://localhost:8080/api/jobportal/getByRequirement/${job.requirementId}`
//         );
//         job.applications = res.data.length;
//       }

//       setAllJobs(jobList);
//       setJobs(jobList);
//       setFilteredJobs(jobList);

//     } catch (error) {
//       console.error("❌ Error fetching jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchJobs();
// }, [effectiveRole]);


  // // Fetch recruiter’s posted jobs
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(`${API_BASE_PORTAL}/getAllRequirements`);
  //       setJobs(res.data || []);
  //     } catch (err) {
  //       console.error("Error fetching jobs:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchJobs();
  // }, []);

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

const handleViewJD = async (requirementId, applicationId) => {
  try {
    const res = await axios.get(`${API_BASE_PORTAL}/getRequirementById/${requirementId}`);
    setSelectedJD(res.data);
    setShowJDModal(true);

    await axios.put(`${API_BASE_PORTAL}/markViewed/${applicationId}`);

   
  } catch (error) {
    console.error("Error fetching JD or updating status:", error);
  }
};

  const handleLogout = async () => {
    if (!user) {
      console.error("No user found in context");
      return;
    }

    const { userName, role } = user;

    try {
      if (role === "portalemp") {
        // 🔵 Portal Employee uses the COMMON logout API
        await axios.post(
          `${API_BASE_PORTAL}/logoutUser?userName=${userName}&userType=portalemp`
        );
      } else {
        // 🔴 Recruiter / TL / Manager / SuperUser use ATS logout API
        let body = {};

        switch (user.role) {
          case "SuperUser":
            body = { superUserId: user.userId };
            break;
          case "Manager":
            body = { managerId: user.userId };
            break;
          case "TeamLeader":
            body = { teamLeaderId: user.userId };
            break;
          case "Recruiters":
            body = { employeeId: user.userId };
            break;
          default:
            throw new Error("Invalid role for logout");
        }

        const apiUrl = `${API_BASE_URL}/user-logout-157/${user.role}`;

        await axios.post(apiUrl, body);
      }

      logoutUser();
      setShowLogoutPopup(false);
      setOpenPanel(null);
      navigate("/loginemp");

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

const [stats, setStats] = useState({
  totalCandidates: 0,
  shortlisted: 0,
  interviewScheduled: 0
});
useEffect(() => {
  const fetchRecruiterStats = async () => {
    try {
      if (effectiveRole === "recruiter" && user?.userId) {
        const res = await axios.get(
          `${API_BASE_PORTAL}/api/jobportal/recruiter-stats/${user.userId}`
        );

        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching recruiter stats:", error);
    }
  };

  fetchRecruiterStats();
}, [effectiveRole, user]);

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

            {/* Show panel only if openPanel === "profile" */}
            {openPanel === "profile" && (
              <div className="profile-panel">
                <p>Profile content goes here</p>
              </div>
            )}
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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLogoutPopup(true);  // show popup
                setOpenPanel(null);
              }}
            >
              <FaSignOutAlt className="quick-icon" /> Logout
            </a>

          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div className="logout-popup-overlay">
          <div className="logout-popup">
            <h3>Are you sure you want to logout?</h3>

            <div className="logout-popup-buttons">
              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>
            </div>
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
<p>{stats.totalCandidates}</p>
            </div>
            <div className="stat-card">
              <FaClipboardList size={28} color="#43a047" />
              <h3>Shortlisted</h3>
<p>{stats.shortlisted}</p>            </div>
            <div className="stat-card">
              <FaUserTie size={28} color="#f57c00" />
              <h3>Interviews Scheduled</h3>
<p>{stats.interviewScheduled}</p>            </div>
          </div>

          {/* === Search Bar === */}
      <div className="search-bar">
  <FaSearch className="search-icon" />
  <input
    type="text"
    placeholder="Search by designation..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>


          {/* === My Posted Jobs === */}
        {/* === My Posted Jobs / Search Results === */}
<h2 className="section-title">
  {showCandidates ? "Candidates" : "My Posted Jobs"}
</h2>

{loading ? (
  <p>Loading...</p>
) : showCandidates ? (

  /* ================== CANDIDATE LIST ================== */
<div className="candidate-card-container">
  {searchedCandidates.map((c) => (
    <CandidateCard
      key={c.id}
      c={c}
      onViewProfile={handleViewResume}
    />
  ))}
</div>


) : (

  /* ================== JD LIST ================== */
  jobs.length === 0 ? (
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
            <button
              className="recJobCard-invite-btn"
              onClick={() =>
                handleSentInvites(job.requirementId, job.designation)
              }
            >
              Send Invites
            </button>
          </div>
        </div>
      ))}
    </div>
  )

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
                        gap: "10px", 
                      }}
                    >
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
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants
                      .slice()
                      .sort((a, b) => {
                        if (a.testScore != null && b.testScore != null) {
                          return b.testScore - a.testScore;
                        }
                        if (a.testScore != null && b.testScore == null) {
                          return -1;
                        }
                        if (a.testScore == null && b.testScore != null) {
                          return 1;
                        }
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
    {c.status === "viewed"
      ? "Viewed"
      : c.status === "shortlisted"
      ? "Shortlisted"
      : c.status === "hired"
      ? "Hired"
      : "Pending"}
  </td>
{/* <td> */}

  {/* View Profile — ONLY for portal_emp */}
  {/* {user?.userType?.toLowerCase() === "portal_emp" && (
    <button
      className="applied-btn"
      onClick={() => handleViewResume(c.jobApplicationId)}
    >
      View Profile
    </button>
  )} */}

  {/* <button
      className="applied-btn"
      onClick={() => handleViewResume(c.jobApplicationId)}
    >
      View Profile
    </button> */}

  {/* Add to Line Up — ONLY for recruiter */}
  {/* {user?.userType?.toLowerCase() === "newRecruiter" && (
    <button
      className="applied-btn lineup-btn"
      style={{ marginLeft: "10px", background: "#4caf50", color: "#fff" }}
      onClick={() => console.log("Add to Lineup clicked for", c.jobApplicationId)}
    >
      Add to Line Up
    </button>
  )}

</td> */}
<td>
  {/* PORTAL EMPLOYEE → View Profile */}
  {effectiveRole === "portalemp" && (
    <button
      className="applied-btn"
      onClick={() => handleViewResume(c.jobApplicationId)}
    >
      View Profile
    </button>
  )}

  {/* RECRUITER → Add to Line Up */}
  {effectiveRole === "recruiter" && (
    <button
      className="applied-btn lineup-btn"
      style={{ marginLeft: "10px", background: "#4caf50", color: "#fff" }}
      onClick={() => console.log("Add to Calling", c.jobApplicationId)}
    >
      Add to Calling
    </button>
  )}
</td>







{/* <button 
  className="btn-small primary-btn"
  onClick={() => updateStatus(c.jobApplicationId, "shortlisted")}
>
  Shortlist
</button> */}

{/* <button 
  className="btn-small danger-btn"
  onClick={() => updateStatus(c.jobApplicationId, "hired")}
>
  Hire
</button> */}

                        
                        </tr>
                      ))}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    {showInvitePopup && (
  <div className="invite-popup-overlay">
    <div className="invite-popup-box large">

      <div className="invite-header">
        <h3>Applicants for {selectedJobTitle}</h3>
        <button onClick={() => setShowInvitePopup(false)}>×</button>
      </div>

      <p><strong>Total Applied:</strong> {candidateCount}</p>

      {/* SELECT ALL */}
      <div className="select-all-row">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
        />
        <label>Select All</label>
      </div>

      {/* CANDIDATE LIST */}
      <div className="invite-list">
        {inviteCandidates.map((c) => (
          <div key={c.candidateId} className="invite-candidate-row">
            <input
              type="checkbox"
              checked={selectedCandidateIds.includes(c.candidateId)}
              onChange={() => toggleCandidate(c.candidateId)}
            />

            <div>
              <p><strong>{c.fullName}</strong></p>
              <p>{c.contactNumber}</p>
              <p>{c.educationalQualification}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="invite-popup-actions">
        <button
          className="btn-primary"
          disabled={selectedCandidateIds.length === 0}
          onClick={handleSendAllInvites}
        >
          Send Invites ({selectedCandidateIds.length})
        </button>

        <button
          className="btn-secondary"
          onClick={() => setShowInvitePopup(false)}
        >
          Cancel
        </button>
      </div>

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