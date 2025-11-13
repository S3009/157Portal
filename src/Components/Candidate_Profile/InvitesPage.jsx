// Samruddhi Patole
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InvitesPage.css";

const InvitesPage = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/jobportal/candidate/${candidateId}`
        );

        const data = response.data;

        if (data.length > 0) {
          setInvites(data);
          setSelectedJob(data[0]);
        } else {
          setInvites([]);
        }
      } catch (err) {
        console.error("Error fetching invites:", err);
        setError("Failed to load invites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  const handleApplyNow = () => {
    if (selectedJob) {
      navigate(`/apply/${selectedJob.id}`);
    }
  };

  return (
    <div className="invites-page">
      <div className="left-section">
        <h2>Job Invites</h2>

        {loading ? (
          <p>Loading invites...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : invites.length === 0 ? (
          <p>No invites received yet.</p>
        ) : (
          <ul className="invite-list">
            {invites.map((job) => (
              <li
                key={job.id}
                className={`invite-card ${
                  selectedJob?.id === job.id ? "active" : ""
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="invite-card-header">
                  <div>
                    <h4>{job.designation}</h4>
                    <p>Invite ID: {job.id}</p>
                  </div>
                </div>
                <p className="invite-meta">
                  📅 {job.date} &nbsp;|&nbsp; 👔 Recruiter ID: {job.recruiterId}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="right-section">
        {selectedJob ? (
          <div className="jd-container">
            <h2>{selectedJob.designation}</h2>
            <p>
              <strong>Recruiter ID:</strong> {selectedJob.recruiterId}
            </p>
            <p>
              <strong>Sent On:</strong> {selectedJob.date}
            </p>

            <button className="apply-btn" onClick={handleApplyNow}>
              Apply Now
            </button>
          </div>
        ) : (
          <p>Select an invite to view details</p>
        )}
      </div>
    </div>
  );
};

export default InvitesPage;
