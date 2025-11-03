// Samruddhi Patole 30/10/25

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./AppliedJobs.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        // ✅ No login required now — fetch all applications
        const res = await axios.get("http://localhost:8080/api/applications/all");

        // ✅ Sort by latest first
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
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="view-jd-link"
                >
                  View Job Description ↗
                </a>
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
                onClick={() =>
                  alert(
                    `Full Name: ${application.fullName}\nEmail: ${application.email}\nContact: ${application.contactNumber}`
                  )
                }
              >
                View Application
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
