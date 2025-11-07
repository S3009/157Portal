// Samruddhi Patole - 2025
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaClock, FaTimes } from "react-icons/fa";
import "./AppliedJobs.css";
import { useNavigate } from "react-router-dom";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch JD Details from Backend
  const handleViewJD = async (requirementId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/requirements/${requirementId}`
      );
      setSelectedJD(res.data);
      setShowJDModal(true);
    } catch (error) {
      console.error("Error fetching JD:", error);
      alert("Unable to load job description.");
    }
  };

  // ✅ Fetch applied jobs list
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/applications/all");
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
        setAppliedJobs(sorted);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setError("Failed to load applied jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  if (loading)
    return <p className="loading-text">Loading your applied jobs...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="applied-container">
      <h1>Applied Jobs</h1>

      {appliedJobs.length === 0 ? (
        <p className="no-jobs">No job applications have been submitted yet.</p>
      ) : (
        <div className="applied-list">
          {appliedJobs.map((application, i) => (
            <div className="applied-card" key={i}>
              <div className="applied-header">
                <h2>{application.requirementInfo?.designation || "N/A"}</h2>
                <button
                  className="view-jd-link"
                  onClick={() =>
                    handleViewJD(application.requirementInfo?.requirementId)
                  }
                >
                  View Job Description ↗
                </button>
              </div>

              <div className="applied-info">
                <p>
                  <FaBuilding className="icon" />{" "}
                  {application.requirementInfo?.companyName || "Unknown Company"}
                </p>
                <p>
                  <FaMapMarkerAlt className="icon" />{" "}
                  {application.requirementInfo?.location || "N/A"}
                </p>
                <p>
                  <FaClock className="icon" /> Applied on{" "}
                  {application.submittedAt
                    ? new Date(application.submittedAt).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )
                    : "N/A"}
                </p>
              </div>

              <button
                className="applied-btn"
                onClick={() => setSelectedJob(application)}
              >
                View Application Status
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ STATUS MODAL */}
       {selectedJob && (
        <div className="status-modal">
          <div className="status-modal-content split-layout">
            {/* Left Side */}
            <div className="modal-left-side">
              <div className="left-job-card">
                <h2>{selectedJob.requirementInfo?.designation || "N/A"}</h2>
                <p className="company">
                  {selectedJob.requirementInfo?.companyName || "Unknown Company"}
                </p>
                <p className="location">
                  {selectedJob.requirementInfo?.location || "N/A"}
                </p>
                <p className="applied-date">
                  Applied on{" "}
                  {new Date(selectedJob.submittedAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>

                <button
                  className="view-jd-link"
                  onClick={() =>
                    handleViewJD(selectedJob.requirementInfo?.requirementId)
                  }
                >
                  View Job Description ↗
                </button>
              </div>
            </div>

            {/* ✅ Right Side — Status Tracker */}
            {/* ✅ Right Side — Naukri-Style Status Panel */}
 <div className="modal-right-side">
              <button
                className="close-btn-modal"
                onClick={() => setSelectedJob(null)}
              >
                <FaTimes />
              </button>

              <div className="job-summary-header">
                <h2>{selectedJob.requirementInfo?.designation || "N/A"}</h2>
                <p className="company">
                  {selectedJob.requirementInfo?.companyName || "Unknown Company"}
                </p>
                <p className="applied-date">
                  Applied on{" "}
                  {new Date(selectedJob.submittedAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              {/* ✅ Dynamic Status Tracker */}
              {(() => {
                const statusMap = {
                  pending: "Applied",
                  sent: "Application Sent",
                  viewed: "Viewed by Recruiter",
                  shortlisted: "Shortlisted",
                  hired: "Hired",
                  rejected: "Rejected",
                };

                const normalizedStatus =
                  statusMap[selectedJob.status?.toLowerCase()] || "Applied";

                const stages = [
                  "Applied",
                  "Application Sent",
                  "Viewed by Recruiter",
                  "Shortlisted",
                  normalizedStatus === "Rejected" ? "Rejected" : "Hired",
                ];

                const currentIndex = stages.findIndex((s) =>
                  s.toLowerCase().includes(normalizedStatus.toLowerCase())
                );

                return (
                  <div className="status-tracker-naukri">
                    {stages.map((stage, index) => {
                      const isDone = index <= currentIndex;
                      return (
                        <React.Fragment key={stage}>
                          <div
                            className={`tracker-step ${
                              isDone ? "done" : "pending"
                            }`}
                          >
                            <div className="circle"></div>
                            <p>{stage}</p>
                          </div>
                          {index < stages.length - 1 && (
                            <div
                              className={`tracker-line ${
                                isDone ? "done" : "pending"
                              }`}
                            ></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Activity Box */}
              <div className="activity-box">
                <h3>Activity on this Job</h3>
                <div className="activity-grid">
                  <div>
                    <p className="activity-number">816</p>
                    <p>Total Applications</p>
                  </div>
                  <div>
                    <p className="activity-number">05</p>
                    <p>Applications Viewed</p>
                  </div>
                </div>
              </div>

{/* ✅ What May Work For You Section (Naukri-style) */}
<div className="what-works-box">
  <h3>What may work for you?</h3>
  <p className="what-works-sub">
    Following criteria suggests how well you match with the job.
  </p>

  <div className="works-criteria">
    {[
      { label: "Early Applicant", match: true },
      { label: "Keyskills", match: false },
      { label: "Location", match: true },
      { label: "Work Experience", match: false },
      { label: "Industry", match: false },
      { label: "Department", match: false },
    ].map((item, index) => (
      <div key={index} className="criteria-item">
        <span className={`criteria-icon ${item.match ? "match" : "nomatch"}`}>
          {item.match ? "✔" : "✖"}
        </span>
        <span className="criteria-label">{item.label}</span>
      </div>
    ))}
  </div>
</div>

              {/* Recruiter Info */}
              <div className="recruiter-info-box">
                <h3>Recruiter Details</h3>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedJob.recruiterName || "Not Assigned"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedJob.recruiterEmail || "N/A"}
                </p>
                <p>
                  <strong>Last Active:</strong>{" "}
                  {selectedJob.recruiterLastActive || "2 days ago"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ JOB DESCRIPTION MODAL */}
      {showJDModal && selectedJD && (
        <div className="jd-modal-overlay">
          <div className="jd-modal">
            <button
              className="jd-close-btn"
              onClick={() => setShowJDModal(false)}
            >
              ✕
            </button>

            <h2 className="jd-title">{selectedJD.designation}</h2>
            <p>
              <strong>Company:</strong> {selectedJD.companyName}
            </p>
            <p>
              <strong>Location:</strong> {selectedJD.location}
            </p>
            <p>
              <strong>Experience:</strong> {selectedJD.experience}
            </p>
            <p>
              <strong>Salary:</strong> {selectedJD.salary}
            </p>
            <p>
              <strong>Job Type:</strong> {selectedJD.jobType}
            </p>

            <h3>Qualification & Skills</h3>
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
              <strong>Skills:</strong> {selectedJD.skills}
            </p>

            <h3>Responsibilities</h3>
            {Array.isArray(selectedJD.responsibilities)
              ? selectedJD.responsibilities.map((r, i) => (
                  <p key={i}>{r.responsibilitiesMsg}</p>
                ))
              : selectedJD.responsibilities || "No details available."}

            <h3>Job Requirements</h3>
            {Array.isArray(selectedJD.jobRequirements)
              ? selectedJD.jobRequirements.map((r, i) => (
                  <p key={i}>{r.requirementMsg}</p>
                ))
              : selectedJD.jobRequirements || "No details available."}

            <h3>Preferred Qualifications</h3>
            {Array.isArray(selectedJD.preferredQualifications)
              ? selectedJD.preferredQualifications.map((p, i) => (
                  <p key={i}>{p.preferredQualificationMsg}</p>
                ))
              : selectedJD.preferredQualifications ||
                "No details available."}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
