// Samruddhi Patole - 2025
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaClock, FaTimes } from "react-icons/fa";
import "./AppliedJobs.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_PORTAL } from "../../API/api";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);

  const navigate = useNavigate();

  const handleViewJD = async (requirementId) => {
    try {
      const res = await axios.get(
        `${API_BASE_PORTAL}/getRequirementById/${requirementId}`
      );
      setSelectedJD(res.data);
      setShowJDModal(true);
    } catch (error) {
      console.error("Error fetching JD:", error);
      alert("Unable to load job description.");
    }
  };

const fetchApplicationStatus = async (applicationId) => {
  try {
    const res = await axios.get(`${API_BASE_PORTAL}/getApplicationStatus/${applicationId}`);
    return res.data?.status;
  } catch (err) {
    return null;
  }
};


const handleViewStatus = async (application) => {
  const appId = application.applicationId || application.id;
  const latestStatus = await fetchApplicationStatus(appId);

  setSelectedJob({
    ...application,
    status: latestStatus || application.status || "pending",
  });
};

 
useEffect(() => {
  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_PORTAL}/getAllApplications`);
      const apps = res.data || [];

      const appsWithStatus = await Promise.all(
        apps.map(async (app) => {
          const applicationId = app.applicationId || app.id;
          let status = "pending";

          try {
            const statusRes = await axios.get(
              `${API_BASE_PORTAL}/getApplicationStatus/${applicationId}`
            );
            status = statusRes.data.status;
          } catch (err) {
            console.log("Error fetching status for", applicationId);
          }

          return {
            ...app,
            status: status,
          };
        })
      );

      const sorted = appsWithStatus.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() -
          new Date(a.submittedAt).getTime()
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


  if (loading) return <p className="loading-text">Loading your applied jobs...</p>;
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
                    ? new Date(application.submittedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              <button
                className="applied-btn"
                onClick={() => handleViewStatus(application)}
              >
                View Application Status
              </button>
            </div>
          ))}
        </div>
      )}

      {/* STATUS MODAL */}
      {selectedJob && (
        <div className="status-modal">
          <div className="status-modal-content split-layout">
            <div className="modal-left-side">
              <div className="left-job-card">
                <h2>{selectedJob.requirementInfo?.designation || "N/A"}</h2>
                <p className="company">
                  {selectedJob.requirementInfo?.companyName || "Unknown Company"}
                </p>
                <p className="location">{selectedJob.requirementInfo?.location || "N/A"}</p>
                <p className="applied-date">
                  Applied on{" "}
                  {new Date(selectedJob.submittedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
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
                  {new Date(selectedJob.submittedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Dynamic Status Tracker */}
              <div className="status-tracker-naukri">
                {[
                  "Applied",
                  "Application Sent",
                  "Viewed ",
                  "Awaiting For Recruiter Action",
                  // "Hired",
                ].map((stage, index) => {
                  let isDone = false;
                  const backendStatus = selectedJob.status?.toLowerCase();

                if (stage === "Viewed ") {
  isDone =
    backendStatus === "viewed" ||
    backendStatus === "Awaiting For Recruiter Action" 
    // backendStatus === "hired" ;
    // backendStatus === "rejected";
}

else if (stage === "Awaiting For Recruiter Action") {
  isDone =
    backendStatus === "Awaiting For Recruiter Action" 
    // backendStatus === "hired" ;
    // backendStatus === "rejected";
}

// else if (stage === "Hired") {
//   isDone =
//     backendStatus === "hired" ;
//     // backendStatus === "rejected";
// }

else if (stage === "Applied") {
  isDone = true;
}

else if (stage === "Application Sent") {
  isDone =
    backendStatus === "sent" ||
    backendStatus === "viewed" ||
    backendStatus === "Awaiting For Recruiter Action" ;
    // backendStatus === "hired" ;
    // backendStatus === "rejected";
}

                  return (
                    <React.Fragment key={stage}>
                      <div className={`tracker-step ${isDone ? "done" : "pending"}`}>
                        <div className="circle"></div>
                        <p>{stage}</p>
                      </div>
                      {index < 4 && (
                        <div
                          className={`tracker-line ${isDone ? "done" : "pending"}`}
                        ></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

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

              {/* What May Work For You Section */}
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
                      <span
                        className={`criteria-icon ${item.match ? "match" : "nomatch"}`}
                      >
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
                  <strong>Name:</strong> {selectedJob.recruiterName || "Not Assigned"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedJob.recruiterEmail || "N/A"}
                </p>
                <p>
                  <strong>Last Active:</strong> {selectedJob.recruiterLastActive || "2 days ago"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB DESCRIPTION MODAL */}
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
              : selectedJD.preferredQualifications || "No details available."}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
