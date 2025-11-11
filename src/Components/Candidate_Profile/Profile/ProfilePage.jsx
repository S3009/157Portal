import "./Profile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import profileImage from "../../../assets/defaultProfile.jpg"; 
import rgLogo from "../../../assets/rgLogo.png";
import KeySkillsSection from "./KeySkillsSection"
import EmploymentModal from "./EmploymentModal";
import EducationModal from "./EducationModal";
import ProjectModal from "./ProjectModal";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import BasicDetailsModal from "./BasicDetailsModal";
import CertificationModal from "./CertificationModal";
import PersonalDetailsModal from "./PersonalDetailsModal";
import { Camera } from "lucide-react"; 
import axios from "axios";
import 'remixicon/fonts/remixicon.css';
import { useUser } from "../../UserContext";


const ProfilePage = () => {

  const API_BASE_URL = "http://localhost:8080/api/profile"; // Adjust if needed
  const [resumeHeadline, setResumeHeadline] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadDate, setUploadDate] = useState(null);
  const [showEmploymentModal, setShowEmploymentModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [introVideo, setIntroVideo] = useState(null);
  const [showBasicDetailsModal, setShowBasicDetailsModal] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const { candidateId } = useParams();
  const [personalDetails, setPersonalDetails] = useState(null);

      useEffect(() => {
        const sections = document.querySelectorAll(
          "#resume, #headline, #skills, #employment, #education, #projects, #certifications, #personal"
        );

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
              }
            });
          },
          { threshold: 0.5 }
        );

        sections.forEach((sec) => observer.observe(sec));

        return () => observer.disconnect();
      }, []);

    useEffect(() => {
      fetchCandidateData(candidateId);
    }, [candidateId]);

  const fetchCandidateData = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/jobportal/api/profile/${id}`);
      if (res.data && Object.keys(res.data).length > 0) {
        // returning user: load data
        setPersonalDetails(res.data.personalDetails || {});
        setBasicDetails(res.data.basicDetails || {});
        setEducation(res.data.educationList || []);
        setEmployment(res.data.employmentList || []);
        setProjects(res.data.projectList || []);
        setCertifications(res.data.certificationList || []);
      } else {
        // new user: empty sections
        setPersonalDetails(null);
        setBasicDetails({});
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };



  const handleVideoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:8080/api/profile/uploadVideo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(res.data);

    // Show uploaded video immediately
    setIntroVideo(`http://localhost:8080/api/profile/videos/${file.name}`);
  } catch (err) {
    console.error("Video upload failed:", err);
    alert("❌ Failed to upload video: " + err.message);
  }
};



    const handleDeleteVideo = () => {
      if (window.confirm("Are you sure you want to delete your intro video?")) {
        setIntroVideo(null);
        alert("🗑️ Video removed successfully!");
      }
    };

      const handleSaveCertification = (newCert) => {
      setCertifications((prev) => [...prev, newCert]);
    };

     const handleDeleteDocument = () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setPersonalDetails((prev) => ({ ...prev, documentName: "", documentFile: null }));
      alert("🗑️ Document deleted successfully!");
    }
  };

  const [BasicDetails, setBasicDetails] = useState({
    name: " ",
    designation: "",
    company: "",
    location: "",
    experience: "",
    salary: "",
    phone: "",
    email: "",
    noticePeriod: "",
    linkedin: "",
  });



  // ---------- BASIC DETAILS CRUD ----------

    const createBasicDetails = async (details) => {
    try {
      const candidateId = localStorage.getItem("candidateId");
      const response = await axios.post(
        `${API_BASE_URL}/createBasicDetails/${candidateId}`,
        details
      );
      alert("✅ Basic Details Created!");
      setBasicDetails(response.data);
    } catch (error) {
      alert("❌ Failed to create Basic Details: " + error.message);
    }
  };


    const fetchAllBasicDetails = async () => {
    try {
      const candidateId = localStorage.getItem("candidateId");
      const response = await axios.get(`${API_BASE_URL}/getAll/${candidateId}`);
      console.log("All Details:", response.data);
    } catch (error) {
      console.error("❌ Error fetching details:", error.message);
    }
  };


  const fetchBasicDetailsById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getBasicDetails/${id}`);
      setBasicDetails(response.data);
    } catch (error) {
      console.error("❌ Error fetching detail:", error.message);
    }
  };

    const updateBasicDetails = async (id, updatedData) => {
    try {
      const candidateId = localStorage.getItem("candidateId");
      const response = await axios.put(
        `${API_BASE_URL}/updateBasicDetails/${id}/${candidateId}`,
        updatedData
      );
      setBasicDetails(response.data);
      alert("✅ Basic Details Updated!");
    } catch (error) {
      alert("❌ Failed to update: " + error.message);
    }
  };

  const deleteBasicDetails = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      alert("🗑️ Basic Details Deleted!");
      setBasicDetails({
        name: "",
        designation: "",
        company: "",
        location: "",
        experience: "",
        salary: "",
        phone: "",
        email: "",
        noticePeriod: "",
        linkedin: "",
      });
    } catch (error) {
      alert("❌ Failed to delete record: " + error.message);
    }
  };

  //-------------------- Employment CRUD --------------------------

  const createEmployment = async (employmentData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/createEmployment`, employmentData);
      setEmployment((prev) => [...prev, res.data]);
      alert("✅ Employment record added!");
    } catch (err) {
      alert("❌ Failed to create employment: " + err.message);
    }
  };

  const fetchAllEmployment = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getAllEmp`);
      if (Array.isArray(res.data)) setEmployment(res.data);
    } catch (err) {
      console.error("❌ Error fetching employment:", err.message);
    }
  };

  const updateEmployment = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/updateEmployment/${id}`, updatedData);
      setEmployment((prev) =>
        prev.map((emp) => (emp.id === id ? res.data : emp))
      );
      alert("✅ Employment record updated!");
    } catch (err) {
      alert("❌ Failed to update employment: " + err.message);
    }
  };

  const deleteEmployment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteEmployment/${id}`);
      setEmployment((prev) => prev.filter((emp) => emp.id !== id));
      alert("🗑️ Employment record deleted!");
    } catch (err) {
      alert("❌ Failed to delete employment: " + err.message);
    }
  };

  useEffect(() => {
  fetchAllEmployment();
  }, []);

  //-------------------- Education CRUD --------------------------

  const createEducation = async (educationData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/createEducation`, educationData);
      setEducation((prev) => [...prev, res.data]);
      alert("✅ Education record added!");
    } catch (err) {
      alert("❌ Failed to create education: " + err.message);
    }
  };

  const fetchAllEducation = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/allEducation`);
      if (Array.isArray(res.data)) setEducation(res.data);
    } catch (err) {
      console.error("❌ Error fetching education:", err.message);
    }
  };

  const updateEducation = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/updateEducation/${id}`, updatedData);
      setEducation((prev) => prev.map((edu) => (edu.id === id ? res.data : edu)));
      alert("✅ Education record updated!");
    } catch (err) {
      alert("❌ Failed to update education: " + err.message);
    }
  };

  const deleteEducation = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteEducation/${id}`);
      setEducation((prev) => prev.filter((edu) => edu.id !== id));
      alert("🗑️ Education record deleted!");
    } catch (err) {
      alert("❌ Failed to delete education: " + err.message);
    }
  };

  // Fetch all education records when page loads
  useEffect(() => {
    fetchAllEducation();
  }, []);

  //-------------------- Project CRUD --------------------------

  const createProject = async (projectData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/create`, projectData);
      setProjects((prev) => [...prev, res.data]);
      alert("✅ Project added successfully!");
    } catch (err) {
      alert("❌ Failed to create project: " + err.message);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getallprojects`);
      if (Array.isArray(res.data)) setProjects(res.data);
    } catch (err) {
      console.error("❌ Error fetching projects:", err.message);
    }
  };

  const updateProject = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/updateProject/${id}`, updatedData);
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? res.data : proj))
      );
      alert("✅ Project updated successfully!");
    } catch (err) {
      alert("❌ Failed to update project: " + err.message);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/deleteProjectById/${id}`);
      setProjects((prev) => prev.filter((proj) => proj.id !== id));
      alert("🗑️ Project deleted successfully!");
    } catch (err) {
      alert("❌ Failed to delete project: " + err.message);
    }
  };

  // Fetch all projects on load
  useEffect(() => {
    fetchAllProjects();
  }, []);

  //-------------------- Certification CRUD --------------------------

  const createCertification = async (certData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/createCertification`, certData);
      setCertifications((prev) => [...prev, res.data]);
      alert("✅ Certification added successfully!");
    } catch (err) {
      alert("❌ Failed to create certification: " + err.message);
    }
  };

  const fetchAllCertifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/getallCertification`);
      if (Array.isArray(res.data)) setCertifications(res.data);
    } catch (err) {
      console.error("❌ Error fetching certifications:", err.message);
    }
  };

  const updateCertification = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/updateCertification/${id}`, updatedData);
      setCertifications((prev) =>
        prev.map((cert) => (cert.id === id ? res.data : cert))
      );
      alert("✅ Certification updated successfully!");
    } catch (err) {
      alert("❌ Failed to update certification: " + err.message);
    }
  };

  const deleteCertification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/deleteCertification/${id}`);
      setCertifications((prev) => prev.filter((cert) => cert.id !== id));
      alert("🗑️ Certification deleted successfully!");
    } catch (err) {
      alert("❌ Failed to delete certification: " + err.message);
    }
  };

  useEffect(() => {
    fetchAllCertifications();
  }, []);

  //-------------------- Personal Details CRUD --------------------------

  const createPersonalDetails = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/createPersonalDetails`, data);
    setPersonalDetails(res.data); // ✅ directly store object
    alert("✅ Personal details added successfully!");
  } catch (err) {
    alert("❌ Failed to create personal details: " + err.message);
  }
};

const fetchAllPersonalDetails = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/getAllPersonalDetails`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      setPersonalDetails(res.data[0]); // ✅ take the first record
    }
  } catch (err) {
    console.error("❌ Error fetching personal details:", err.message);
  }
};


  const updatePersonalDetails = async (id, updatedData) => {
    try {
    const res = await axios.put(`${API_BASE_URL}/updatePersonalDetails/${id}`, updatedData);
    setPersonalDetails(res.data); // ✅ updated object
    alert("✅ Personal details updated successfully!");
  } catch (err) {
    alert("❌ Failed to update personal details: " + err.message);
  }
};

  const deletePersonalDetails = async (id) => {
  if (!window.confirm("Are you sure you want to delete this personal record?")) return;
  try {
    await axios.delete(`${API_BASE_URL}/deleteProfileDetails/${id}`);
    setPersonalDetails({
      fullName: "",
      gender: "",
      dob: "",
      maritalStatus: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      nationality: "",
      documentName: "",
      documentFile: null,
    });
    alert("🗑️ Personal details deleted successfully!");
  } catch (err) {
    alert("❌ Failed to delete personal details: " + err.message);
  }
};

  // Fetch all on page load
  useEffect(() => {
    fetchAllPersonalDetails();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setJobResults([]);

    try {
      // Replace this with your backend API URL
      const response = await fetch(
        `http://localhost:5000/api/jobs?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 6;

    if (resumeFile) completed++;
    if (resumeHeadline.trim() !== "") completed++;
    if (skills.length > 0) completed++;
    if (employment.length > 0) completed++;
    if (education.length > 0) completed++;
    if (projects.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };


  const profileCompletion = calculateProfileCompletion();

  // ✅ Handle headline change
  const handleHeadlineChange = (e) => {
    setResumeHeadline(e.target.value);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/uploadResume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeFile(file.name);
      setUploadDate(new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }));
      alert(`✅ ${file.name} uploaded successfully!`);
    } catch (err) {
      alert("❌ Failed to upload resume: " + err.message);
    }
  };


    // Handle delete resume
    const handleDeleteResume = () => {
      if (window.confirm("Are you sure you want to delete your resume?")) {
        setResumeFile(null);
        setUploadDate(null);
        alert("🗑️ Resume deleted successfully!");
      }
    };

    const saveResumeHeadline = async () => {
      try {
        await axios.post(`${API_BASE_URL}/headline`, { headline: resumeHeadline });
        alert("✅ Headline saved successfully!");
      } catch (err) {
        alert("❌ Failed to save headline: " + err.message);
      }
    };


    const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


 
  return (
    <div className="profile-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img
           src={rgLogo} 
           alt="Logo" 
           className="logo" />
          <nav className="nav-links">
            <a href="#">Jobs</a>
            <a href="#">Companies</a>
            <a href="#">Services</a>
          </nav>
        </div>

      <div className="search-section">
  <input
    type="text"
    placeholder="Search by role or designation..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyPress={handleKeyPress}
  />
 
  <div className="icons">
    <i className="ri-notification-3-line"></i>
    <i className="ri-message-3-line"></i>
  </div>
</div>

{/* Search results below */}
<div className="search-results">
  {loading && <p>🔎 Searching jobs...</p>}
  {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

  {!loading && jobResults.length > 0 && (
    <>
      <h4>Job Results for "{searchQuery}"</h4>
      <ul>
        {jobResults.map((job, index) => (
          <li key={index} className="job-item">
            <strong>{job.title}</strong> — {job.company} ({job.location})
          </li>
        ))}
      </ul>
    </>
  )}

  {!loading && jobResults.length === 0 && searchQuery && !error && (
    <p>No jobs found for "{searchQuery}".</p>
  )}
</div>

      </header>

      {/* Main Layout */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Quick Links</h3>
          <ul>
            {[
              { id: "resume", label: "Resume" },
              { id: "headline", label: "Resume Headline" },
              { id: "skills", label: "Key Skills" },
              { id: "employment", label: "Employment" },
              { id: "education", label: "Education" },
              { id: "project", label: "Projects" },
              { id: "certifications", label: "Certifications" },
              { id: "personal", label: "Personal Details" },
            ].map((item) => (
              <li
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={activeSection === item.id ? "active" : ""}
              >
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>



        {/* Right Section */}
        <section className="profile-details">
          {/* Profile Card */}
      <div className="profile-card">
      < div className="profile-progress-wrapper">
        
        <div className="progress-circle">
          <CircularProgressbar
            value={profileCompletion}
            styles={buildStyles({
              pathTransitionDuration: 1.2,
              pathColor: profileCompletion === 100 ? "#00C853" : "#526d82",
              trailColor: "#e0e0e0",
               
              
            })}
          />
        </div>

            <img src={profileImage} alt="Profile" className="profile-photo-inside" />

            <div className="profile-progress-text">
              {profileCompletion === 100 ? (
                <span className="completion-success">✅ 100%</span>
              ) : (
                <span>{profileCompletion}%</span>
              )}
            </div>
          </div>

              {/* ==================== BASIC DETAILS SECTION ==================== */}
              <div className="personal-details-section">
                <div className="personal-header">
                  <div className="personal-left">
                    {/* <img src={profileImage} alt="Profile" className="personal-photo" /> */}
                    <div>
                      <h2 className="personal-name">{BasicDetails.name}</h2>
                      <p className="personal-role">{BasicDetails.designation}</p>
                      <p className="personal-company"> {BasicDetails.company}</p>
                    </div>
                  </div>

                  <button className="edit-btn" onClick={() => setShowBasicDetailsModal(true)}>
                    <i className="ri-edit-line"></i> Edit
                  </button>
                </div>

                <div className="personal-info">
                  <div className="info-item">
                    <i className="ri-map-pin-line"></i>
                    <span>{BasicDetails.location}</span>
                  </div>
                  <div className="info-item">
                    <i className="ri-time-line"></i>
                    <span>{BasicDetails.experience}</span>
                  </div>
                  <div className="info-item">
                    <i className="ri-money-rupee-circle-line"></i>
                    <span>{BasicDetails.salary}</span>
                  </div>
                  <div className="info-item">
                    <i className="ri-phone-line"></i>
                    <span>{BasicDetails.phone}</span>
                  </div>
                  <div className="info-item">
                    <i className="ri-mail-line"></i>
                    <span>{BasicDetails.email}</span>
                  </div>
                  <div className="info-item">
                    <i className="ri-calendar-check-line"></i>
                    <span>{BasicDetails.noticePeriod} notice period</span>
                  </div>
                  {BasicDetails.linkedin && (
                    <div className="info-item">
                      <i className="ri-linkedin-box-fill" style={{ color: "#0a66c2" }}></i>
                      <a
                        href={BasicDetails.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0a66c2",
                          textDecoration: "none",
                          marginLeft: "6px",
                        }}
                      >
                        View LinkedIn
                      </a>
                    </div>
                  )}

                </div>

                {/* Modal for editing details */}
               {showBasicDetailsModal && (
                  <BasicDetailsModal
                    onClose={() => setShowBasicDetailsModal(false)}
                    details={BasicDetails}
                    onSave={async (updatedDetails) => {
                      // Check if this detail already exists (has an id)
                      if (BasicDetails.id) {
                        await updateBasicDetails(BasicDetails.id, updatedDetails);
                      } else {
                        await createBasicDetails(updatedDetails);
                      }
                      setShowBasicDetailsModal(false);
                    }}
                  />
                )}

              </div>
        </div>

        {/* ==================== INTRO VIDEO SECTION ==================== */}
        <div className="intro-video-section">
          <h3 className="section-title">Intro Video</h3>
          
          {introVideo ? (
              <div className="video-preview">
                <video width="320" height="240" controls>
                  <source src={introVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button className="delete-btn" onClick={handleDeleteVideo}>
                  <i className="ri-delete-bin-line"></i> Remove
                </button>
              </div>
            ) : (
              <label htmlFor="videoUpload" className="upload-btn">
                <i className="ri-video-upload-line"></i> Upload Intro Video
              </label>
            )}


          <input
            type="file"
            id="videoUpload"
            accept="video/mp4,video/mov,video/webm"
            className="hidden-input"
            onChange={handleVideoUpload}
          />
        </div>



         {/* Resume Section */}

        <div id="resume" className="resume-card-section">
            <h3 className="section-title">Resume</h3>
            
            <div className="resume-box">
              {/* Delete button top-right */}
              {resumeFile && (
                <button className="delete-icon-btn" onClick={handleDeleteResume}>
                  <i className="ri-delete-bin-6-line"></i>
                </button>
              )}

              {/* Uploaded file info */}
              {resumeFile ? (
                <div className="uploaded-info">
                  <p>{resumeFile}</p>
                  <small>Uploaded on {uploadDate}</small>
                </div>
              ) : (
                <div className="no-resume">No resume uploaded yet.</div>
              )}

              {/* Upload button */}
              <label htmlFor="fileUpload" className="upload-btn">
                <i className="ri-upload-cloud-line"></i> Upload
              </label>
              <input
                type="file"
                id="fileUpload"
                accept=".pdf,.doc,.docx,.rtf"
                className="hidden-input"
                onChange={handleFileUpload}
              />
            </div>
          </div>


        {/* ==================== RESUME HEADLINE SECTION ==================== */}
      <div id="headline" className="headline-card">
      <h3 className="section-title">Resume Headline</h3>
      <textarea
        className="headline-input"
        placeholder="Write your resume headline..."
        value={resumeHeadline}
        onChange={handleHeadlineChange}
      ></textarea>
      <button className="btn btn-primary" onClick={saveResumeHeadline}>
        Save Headline
      </button>
    </div>


          {/* Skills */}
          <div id="skills" className="skills-card">
            <h3 className="section-title">Key Skills</h3>
              <KeySkillsSection />
          </div>


        <div id="employment" className="section-wrapper">
  <h3 className="section-title">Employment</h3>

  <button className="btn btn-primary" onClick={() => {
    setShowEmploymentModal(true);
    setSelectedEmployment(null); // new record
  }}>
    + Add Employment
  </button>

  {/* Employment Modal */}
  {showEmploymentModal && (
    <EmploymentModal
      onClose={() => setShowEmploymentModal(false)}
      onSave={(data, id) => {
        if (id) updateEmployment(id, data); // Update
        else createEmployment(data);        // Create
        setShowEmploymentModal(false);
      }}
      onDelete={(id) => {
        deleteEmployment(id);
        setShowEmploymentModal(false);
      }}
      selectedEmployment={selectedEmployment}
    />
  )}

  {/* Employment List */}
  <div className="employment-list">
    {employment.length > 0 ? (
      employment.map((emp) => (
        <div key={emp.id} className="employment-item">
          <div className="employment-header">
            <h4 className="job-title">{emp.title}</h4>
            <span
              className="edit-icon"
              onClick={() => {
                setSelectedEmployment(emp);
                setShowEmploymentModal(true);
              }}
            >
              <i className="ri-pencil-line"></i>
            </span>
          </div>
          <p className="company-name">{emp.company}</p>
          <p className="employment-meta">
            {emp.employmentType && <span>{emp.employmentType}</span>}
            {emp.joiningDate && <span> • {emp.joiningDate}</span>}
            {emp.experience && <span> • {emp.experience}</span>}
            {emp.noticePeriod && <span> • {emp.noticePeriod} Notice Period</span>}
          </p>

                  {emp.profile && (
                    <p className="job-description">
                      {emp.profile.length > 200 ? (
                        <>
                          {emp.profile.slice(0, 200)}...{" "}
                          <span className="read-more">Read More</span>
                        </>
                      ) : (
                        emp.profile
                      )}
                    </p>
                  )}

                  {emp.skills && emp.skills.length > 0 && (
                    <p className="skills-line">
                      <strong>Top 5 key skills: </strong>
                      {emp.skills.slice(0, 5).join(", ")}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-employment">No employment added yet.</p>
            )}
          </div>
        </div>


          <div id="education" className="section-wrapper">
            <h3 className="section-title">Education</h3>

            <button
              className="btn btn-primary"
              onClick={() => setShowEducationModal(true)}
            >
              + Add Education
            </button>

           {showEducationModal && (
              <EducationModal
                onClose={() => {
                  setShowEducationModal(false);
                  setSelectedEducation(null); // Reset after closing
                }}
                educationData={selectedEducation} // ✅ Pass existing record for editing
                onSave={async (edu) => {
                  if (selectedEducation && selectedEducation.id) {
                    await updateEducation(selectedEducation.id, edu); // ✅ Update existing
                  } else {
                    await createEducation(edu); // ✅ Create new
                  }
                  setShowEducationModal(false);
                  setSelectedEducation(null);
                }}
              />
            )}


             {/* Education List */}
            <div className="education-list">
              {education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <div className="education-header">
                      <h4 className="education-title">
                        {edu.course} in {edu.specialization}
                      </h4>
                      <div className="education-actions">
                        <span
                          className="edit-icon"
                          onClick={() => {
                            setSelectedEducation(edu); // ✅ Set the education record to be edited
                            setShowEducationModal(true);
                          }}
                        >
                          <i className="ri-pencil-line"></i>
                        </span>
                        <span
                          className="delete-icon"
                          onClick={() => deleteEducation(edu.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </span>
                      </div>
                    </div>
                    <p className="university-name">{edu.university}</p>
                    <p className="education-meta">
                      {edu.courseType && <span>{edu.courseType}</span>}
                      {edu.startYear && edu.endYear && (
                        <span> • {edu.startYear} - {edu.endYear}</span>
                      )}
                      {edu.gradingSystem && <span> • {edu.gradingSystem}</span>}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-education">No education added yet.</p>
              )}
            </div>
          </div>

         <div id="project" className="section-wrapper">
            <h3 className="section-title">Projects</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowProjectModal(true)}
            >
              + Add Project
            </button>

            {/* Project Modal */}
           {showProjectModal && (
              <ProjectModal
                onClose={() => {
                  setShowProjectModal(false);
                  setSelectedProject(null);
                }}
                projectData={selectedProject}
                onSave={(proj) => {
                  if (selectedProject && selectedProject.id) {
                    updateProject(selectedProject.id, proj); // ✅ Update
                  } else {
                    createProject(proj); // ✅ Create
                  }
                  setShowProjectModal(false);
                  setSelectedProject(null);
                }}
              />
            )}


            {/* Project List */}
            <div className="project-list">
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <div key={proj.id} className="project-item">
                    <div className="project-header">
                      <h4 className="project-title">{proj.title}</h4>
                      <div className="project-actions">
                        <span
                          className="edit-icon"
                          onClick={() => {
                            setSelectedProject(proj);
                            setShowProjectModal(true);
                          }}
                        >
                          <i className="ri-pencil-line"></i>
                        </span>
                        <span
                          className="delete-icon"
                          onClick={() => deleteProject(proj.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </span>
                      </div>
                    </div>

                    <p className="project-meta">
                      {proj.client && <span>{proj.client}</span>}
                      {proj.status && <span> • {proj.status}</span>}
                      {proj.month && proj.year && (
                        <span> • {proj.month} {proj.year}</span>
                      )}
                      {proj.tag && <span> • {proj.tag}</span>}
                    </p>

                    {proj.details && (
                      <p className="project-details">
                        {proj.details.length > 200
                          ? proj.details.slice(0, 200) + "..."
                          : proj.details}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-projects">No projects added yet.</p>
              )}
            </div>

          </div>


          <div id="certifications" className="section-wrapper">
            <h3 className="section-title">Certifications</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowCertModal(true)}
            >
              + Add Certification
            </button>

            {/* Certification Modal */}
            {showCertModal && (
              <CertificationModal
                onClose={() => setShowCertModal(false)}
                onSave={(newCert) => {
                  setCertifications((prev) => [...prev, newCert]);
                  setShowCertModal(false);
                }}
              />
            )}
            {showCertModal && (
              <CertificationModal
                onClose={() => {
                  setShowCertModal(false);
                  setSelectedCert(null);
                }}
                certificationData={selectedCert}
                onSave={(certData) => {
                  if (certData.id) {
                    updateCertification(certData.id, certData); // ✅ use id from modal data
                  } else {
                    createCertification(certData);
                  }
                  setShowCertModal(false);
                  setSelectedCert(null);
                }}
              />
            )}



            {/* Certification List */}
            <div className="certification-list">
              {certifications.length > 0 ? (
                certifications.map((cert) => (
                  <div key={cert.id} className="certification-item">
                    <div className="cert-header">
                      <h4 className="cert-name">{cert.name}</h4>
                      <div className="cert-actions">
                        <span
                          className="edit-icon"
                          onClick={() => {
                            setSelectedCert(cert);
                            setShowCertModal(true);
                          }}
                        >
                          <i className="ri-pencil-line"></i>
                        </span>
                        <span
                          className="delete-icon"
                          onClick={() => deleteCertification(cert.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </span>
                      </div>
                    </div>

                    <p className="cert-meta">
                      {cert.doesNotExpire
                        ? "Does not expire"
                        : cert.month && cert.year
                        ? `${cert.month} ${cert.year}`
                        : "No expiration date"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-cert">No certifications added yet.</p>
              )}
            </div>

          </div>


      <div id="personal" className="personal-details-card">
      <div className="personal-header">
  <h3>Personal Details</h3>
  <div className="edit-delete-icons">
    <button
      className="icon-btn edit"
      title="Edit"
      onClick={() => {
        setSelectedPersonal(personalDetails);
        setShowPersonalModal(true);
      }}
    >
      <i className="ri-pencil-line"></i>
    </button>
    <button
      className="icon-btn delete"
      title="Delete"
      onClick={() => deletePersonalDetails(personalDetails.id)}
    >
      <i className="ri-delete-bin-line"></i>
    </button>

    </div>
    </div>


      <div className="details-grid">
        <div>
          <label>Full Name</label>
          <p>{personalDetails?.fullName || "Enter Name"}<span className="blurred">Enter name</span></p>
        </div>
        <div>
          <label>Gender</label>
          <p>{personalDetails?.gender || "Select Gender"} <span className="blurred">Select gender</span></p>
        </div>
        <div>
          <label>Date of Birth</label>
          <p>{personalDetails?.dob || "Enter DOB"} <span className="blurred">Enter DOB</span></p>
        </div>
        <div>
          <label>Marital Status</label>
          <p>{personalDetails?.maritalStatus || "Enter Marital Status"} <span className="blurred">Select status</span></p>
        </div>
        <div>
          <label>Address</label>
          <p>{personalDetails?.address || "Enter Address"} <span className="blurred">Enter address</span></p>
        </div>
        <div>
          <label>City</label>
          <p>{personalDetails?.city || "Enter City"} <span className="blurred">Enter city</span></p>
        </div>
        <div>
          <label>State</label>
          <p>{personalDetails?.state || "Enter State"} <span className="blurred">Enter state</span></p>
        </div>
        <div>
          <label>Pincode</label>
          <p>{personalDetails?.pincode || "Pincode"} <span className="blurred">Enter pincode</span></p>
        </div>
        <div>
          <label>Nationality</label>
          <p>{personalDetails?.nationality || "Nationality" }<span className="blurred">Enter nationality</span></p>
        </div>
        <div className="document-section">
          <label>Additional Document</label>
          {personalDetails?.documentFile ?  (
            <div className="document-preview">
              <p>
                📄 <strong>{personalDetails?.documentName }</strong>
              </p>
              <button className="delete-doc-btn" onClick={handleDeleteDocument}>
                <i className="ri-delete-bin-line"></i> Remove
              </button>
            </div>
          ) : (
            <p className="blurred">No document uploaded</p>
          )}
        </div>
      </div>

      {/* Modal */}
     {showPersonalModal && (
        <PersonalDetailsModal
          onClose={() => {
            setShowPersonalModal(false);
            setSelectedPersonal(null);
          }}
          details={selectedPersonal || {
            fullName: "",
            gender: "",
            dob: "",
            maritalStatus: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            nationality: "",
            documentName: "",
            documentFile: null,
          }}
            onSave={async (data) => {
            if (data.id) {
              await updatePersonalDetails(data.id, data);
            } else {
              await createPersonalDetails(data);
            }

            await fetchAllPersonalDetails(); // ✅ refresh after save
            setShowPersonalModal(false);
            setSelectedPersonal(null);
          }}
        />
      )}
    </div>
    </section>
      </div>
    </div>
  );
};

export default ProfilePage;
